/**
 * Conference fee currency converter (THB base → other currencies).
 * Uses open.er-api.com (no API key). Rates cached in sessionStorage.
 */
(function (global) {
    'use strict';

    var CACHE_KEY = 'munFxRatesThb';
    var CACHE_TTL_MS = 60 * 60 * 1000;
    var API_URL = 'https://open.er-api.com/v6/latest/THB';

    var CURRENCY_NAMES = {
        THB: 'Thai Baht', USD: 'US Dollar', EUR: 'Euro', GBP: 'British Pound',
        SGD: 'Singapore Dollar', MYR: 'Malaysian Ringgit', IDR: 'Indonesian Rupiah',
        PHP: 'Philippine Peso', VND: 'Vietnamese Dong', CNY: 'Chinese Yuan',
        JPY: 'Japanese Yen', KRW: 'South Korean Won', INR: 'Indian Rupee',
        AUD: 'Australian Dollar', CAD: 'Canadian Dollar', CHF: 'Swiss Franc',
        HKD: 'Hong Kong Dollar', TWD: 'New Taiwan Dollar', NZD: 'New Zealand Dollar',
        AED: 'UAE Dirham', SAR: 'Saudi Riyal', QAR: 'Qatari Riyal', BRL: 'Brazilian Real',
        MXN: 'Mexican Peso', ZAR: 'South African Rand', SEK: 'Swedish Krona',
        NOK: 'Norwegian Krone', DKK: 'Danish Krone', PLN: 'Polish Zloty',
        TRY: 'Turkish Lira', RUB: 'Russian Ruble', PKR: 'Pakistani Rupee',
        BDT: 'Bangladeshi Taka', LKR: 'Sri Lankan Rupee', MMK: 'Myanmar Kyat',
        KHR: 'Cambodian Riel', LAK: 'Lao Kip', NPR: 'Nepalese Rupee'
    };

    var PREFERRED_ORDER = [
        'THB', 'USD', 'EUR', 'GBP', 'SGD', 'MYR', 'IDR', 'PHP', 'VND', 'CNY',
        'JPY', 'KRW', 'INR', 'AUD', 'CAD', 'CHF', 'HKD', 'TWD', 'NZD', 'AED'
    ];

    function currencySymbol(code) {
        var symbols = {
            THB: '฿', USD: '$', EUR: '€', GBP: '£', JPY: '¥', CNY: '¥',
            KRW: '₩', INR: '₹', PHP: '₱', RUB: '₽', TRY: '₺', BRL: 'R$',
            VND: '₫', MYR: 'RM', SGD: 'S$', AUD: 'A$', CAD: 'C$', HKD: 'HK$',
            TWD: 'NT$', NZD: 'NZ$', CHF: 'Fr', AED: 'د.إ', SAR: '﷼', IDR: 'Rp',
            PLN: 'zł', SEK: 'kr', NOK: 'kr', DKK: 'kr', ZAR: 'R', MXN: 'MX$'
        };
        if (symbols[code]) return symbols[code];
        try {
            var parts = new Intl.NumberFormat(undefined, {
                style: 'currency',
                currency: code,
                currencyDisplay: 'narrowSymbol'
            }).formatToParts(0);
            var sym = parts.find(function (p) { return p.type === 'currency'; });
            if (sym && sym.value) return sym.value;
        } catch (e) { /* ignore */ }
        return code;
    }

    function parseThbFees(text) {
        if (!text || typeof text !== 'string') return [];
        var items = [];
        var re = /([\d,]+(?:\.\d+)?)\s*THB/gi;
        var matches = [];
        var m;
        while ((m = re.exec(text)) !== null) {
            matches.push({ amount: parseFloat(m[1].replace(/,/g, '')), index: m.index, len: m[0].length });
        }
        matches.forEach(function (match, i) {
            if (isNaN(match.amount) || match.amount < 0) return;
            var labelStart = i === 0 ? 0 : matches[i - 1].index + matches[i - 1].len;
            var label = text.slice(labelStart, match.index)
                .replace(/[·;]/g, ' ')
                .replace(/\(\s*\)/g, '')
                .trim();
            if (i > 0 && label.indexOf('.') >= 0) {
                label = label.slice(label.lastIndexOf('.') + 1).trim();
            }
            label = label
                .replace(/^\([^)]*\)\.?\s*/, '')
                .replace(/^[.\s:)]+/, '')
                .replace(/:\s*$/, '')
                .trim();
            var colonIdx = label.lastIndexOf(':');
            if (colonIdx >= 0) label = label.slice(colonIdx + 1).trim();
            if (/^chair\s*fee$/i.test(label)) label = 'Chair fee';
            if (!label) {
                var after = text.slice(match.index + match.len, i + 1 < matches.length ? matches[i + 1].index : text.length);
                var paren = after.match(/^\s*\(([^)]+)\)/);
                label = paren ? paren[1] : (i === 0 ? 'Delegate fee' : 'Fee');
            }
            items.push({ label: label, amountThb: match.amount });
        });
        return items;
    }

    var FEE_ROLE_LABELS = { delegate: 'Delegate', chair: 'Chair', advisor: 'Advisor' };
    var FEE_ROLE_ORDER = ['delegate', 'chair', 'advisor'];

    function feeRoleKey(item) {
        var label = (item.label || '').toLowerCase();
        if (/advisor/.test(label)) return 'advisor';
        if (/chair/.test(label)) return 'chair';
        if (/delegate|participant|all delegate|school delegate|independent/.test(label)) {
            return 'delegate';
        }
        return label + '@' + item.amountThb;
    }

    function dedupeFees(items) {
        var byRole = {};
        items.forEach(function (item) {
            var key = feeRoleKey(item);
            if (!byRole[key] || FEE_ROLE_LABELS[key]) {
                byRole[key] = {
                    label: FEE_ROLE_LABELS[key] || item.label,
                    amountThb: item.amountThb
                };
            }
        });
        var result = [];
        FEE_ROLE_ORDER.forEach(function (role) {
            if (byRole[role]) result.push(byRole[role]);
        });
        Object.keys(byRole).forEach(function (key) {
            if (FEE_ROLE_ORDER.indexOf(key) < 0) result.push(byRole[key]);
        });
        return result;
    }

    function conferenceHasAdvisors(conf) {
        if (!conf) return false;
        var chunks = [
            conf.extraNotes,
            conf.pricePerDelegate,
            conf.advisorSignupLink,
            conf.size
        ];
        var text = chunks.filter(Boolean).join(' ');
        return /advisor/i.test(text) ||
            !!(conf.advisorAccount && String(conf.advisorAccount).trim());
    }

    function extractFeesFromConference(conf) {
        var fees = [];
        if (conf && conf.pricePerDelegate) {
            fees = parseThbFees(conf.pricePerDelegate);
        }
        if (!fees.length && conf && conf.extraNotes) {
            var feeBlock = conf.extraNotes.match(/<p><strong>Fees:<\/strong>[^<]*<\/p>/i);
            if (feeBlock) fees = parseThbFees(feeBlock[0].replace(/<[^>]+>/g, ' '));
        }
        fees = dedupeFees(fees);
        if (conferenceHasAdvisors(conf) && !fees.some(function (f) { return feeRoleKey(f) === 'advisor'; })) {
            fees.push({ label: 'Advisor', amountThb: 0 });
            fees = dedupeFees(fees);
        }
        return fees;
    }

    function getCachedRates() {
        try {
            var raw = sessionStorage.getItem(CACHE_KEY);
            if (!raw) return null;
            var data = JSON.parse(raw);
            if (!data || !data.rates || Date.now() - data.fetchedAt > CACHE_TTL_MS) return null;
            return data;
        } catch (e) {
            return null;
        }
    }

    function setCachedRates(rates, meta) {
        try {
            sessionStorage.setItem(CACHE_KEY, JSON.stringify({
                rates: rates,
                fetchedAt: Date.now(),
                meta: meta || {}
            }));
        } catch (e) { /* ignore */ }
    }

    function fetchRates() {
        var cached = getCachedRates();
        if (cached) return Promise.resolve(cached);

        return fetch(API_URL)
            .then(function (r) {
                if (!r.ok) throw new Error('Rate fetch failed');
                return r.json();
            })
            .then(function (data) {
                var rates = data.rates || data.conversion_rates;
                if (data.result !== 'success' || !rates || typeof rates !== 'object') {
                    throw new Error('Invalid rate data');
                }
                if (rates.THB == null) rates.THB = 1;
                var payload = {
                    rates: rates,
                    fetchedAt: Date.now(),
                    meta: { timeLastUpdate: data.time_last_update_utc }
                };
                setCachedRates(rates, payload.meta);
                return payload;
            });
    }

    function sortedCurrencyCodes(rates) {
        var codes = Object.keys(rates).filter(function (c) { return c !== 'THB'; });
        codes.sort(function (a, b) {
            var ai = PREFERRED_ORDER.indexOf(a);
            var bi = PREFERRED_ORDER.indexOf(b);
            if (ai >= 0 && bi >= 0) return ai - bi;
            if (ai >= 0) return -1;
            if (bi >= 0) return 1;
            return a.localeCompare(b);
        });
        return ['THB'].concat(codes);
    }

    function formatConverted(amount, code) {
        try {
            return new Intl.NumberFormat(undefined, {
                style: 'currency',
                currency: code,
                maximumFractionDigits: ['JPY', 'KRW', 'VND', 'IDR'].indexOf(code) >= 0 ? 0 : 2
            }).format(amount);
        } catch (e) {
            return currencySymbol(code) + ' ' + amount.toLocaleString(undefined, {
                maximumFractionDigits: 2
            }) + ' ' + code;
        }
    }

    function convertThb(amountThb, code, rates) {
        if (code === 'THB') return amountThb;
        var rate = rates[code];
        if (rate == null) return null;
        return amountThb * rate;
    }

    function buildSelectOptions(codes) {
        return codes.map(function (code) {
            var sym = currencySymbol(code);
            var name = CURRENCY_NAMES[code] || code;
            return '<option value="' + code + '">' + sym + ' ' + code + ' — ' + name + '</option>';
        }).join('');
    }

    function renderResults(fees, code, rates, resultsEl) {
        if (!resultsEl) return;
        var html = fees.map(function (f) {
            var displayAmount = code === 'THB'
                ? f.amountThb
                : convertThb(f.amountThb, code, rates);
            if (displayAmount == null) return '';
            var row = '<div class="currency-converter-row"><span class="currency-converter-label">' +
                escapeHtml(f.label) + '</span><span class="currency-converter-value">' +
                formatConverted(displayAmount, code) + '</span>';
            if (code !== 'THB') {
                row += '<span class="currency-converter-original">(' +
                    f.amountThb.toLocaleString() + ' THB)</span>';
            }
            return row + '</div>';
        }).join('');
        resultsEl.innerHTML = html || '<p class="currency-converter-empty">No convertible fees found.</p>';
    }

    function escapeHtml(s) {
        if (!s) return '';
        return String(s)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    }

    function mount(options) {
        options = options || {};
        var wrap = options.container || document.getElementById('currencyConverterWrap');
        var select = options.selectEl || document.getElementById('currencySelect');
        var resultsEl = options.resultsEl || document.getElementById('currencyConverterResults');
        var statusEl = options.statusEl || document.getElementById('currencyConverterStatus');
        var conf = options.conference;

        if (!wrap || !select || !resultsEl) return;

        var fees = options.fees || extractFeesFromConference(conf);
        if (!fees.length) {
            wrap.hidden = true;
            return;
        }

        wrap.hidden = false;
        if (statusEl) statusEl.textContent = 'Loading exchange rates…';

        fetchRates()
            .then(function (payload) {
                var codes = sortedCurrencyCodes(payload.rates);
                select.innerHTML = buildSelectOptions(codes);
                select.disabled = false;
                var saved = null;
                try { saved = localStorage.getItem('munPreferredCurrency'); } catch (e) { /* */ }
                if (saved && codes.indexOf(saved) >= 0) select.value = saved;
                else select.value = 'USD';

                function update() {
                    var code = select.value;
                    try { localStorage.setItem('munPreferredCurrency', code); } catch (e) { /* */ }
                    renderResults(fees, code, payload.rates, resultsEl);
                    if (statusEl) {
                        var when = payload.meta && payload.meta.timeLastUpdate
                            ? 'Rates updated ' + payload.meta.timeLastUpdate + ' (UTC). Approximate only.'
                            : 'Approximate rates for planning; confirm with your bank.';
                        statusEl.textContent = when;
                    }
                }

                select.onchange = update;
                update();
            })
            .catch(function (err) {
                if (statusEl) {
                    statusEl.textContent = 'Could not load live rates. Showing THB only.';
                }
                select.innerHTML = buildSelectOptions(['THB']);
                select.value = 'THB';
                select.disabled = true;
                renderResults(fees, 'THB', { THB: 1 }, resultsEl);
                if (typeof console !== 'undefined' && console.warn) {
                    console.warn('CurrencyConverter: rate fetch failed', err);
                }
            });
    }

    global.CurrencyConverter = {
        mount: mount,
        parseThbFees: parseThbFees,
        extractFeesFromConference: extractFeesFromConference,
        currencySymbol: currencySymbol
    };
})(typeof window !== 'undefined' ? window : this);
