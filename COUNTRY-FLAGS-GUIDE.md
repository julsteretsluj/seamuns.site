# Country Flags Guide 🌏

## Overview
Country flags are automatically displayed on conference cards and detail pages using Unicode flag emojis.

## How It Works

The system uses **ISO 3166-1 alpha-2** country codes (2-letter codes) to display flags.

### Example:
```javascript
{
    name: "Singapore Model UN",
    location: "Singapore",
    countryCode: "SG"  // 🇸🇬
}
```

The flag 🇸🇬 will automatically appear next to "Singapore" on conference cards and detail pages.

## Common Country Codes for South East Asia

| Country | Code | Flag |
|---------|------|------|
| Brunei | BN | 🇧🇳 |
| Cambodia | KH | 🇰🇭 |
| Indonesia | ID | 🇮🇩 |
| Laos | LA | 🇱🇦 |
| Malaysia | MY | 🇲🇾 |
| Myanmar | MM | 🇲🇲 |
| Philippines | PH | 🇵🇭 |
| Singapore | SG | 🇸🇬 |
| Thailand | TH | 🇹🇭 |
| Timor-Leste | TL | 🇹🇱 |
| Vietnam | VN | 🇻🇳 |

## Other Common Locations

| Country | Code | Flag |
|---------|------|------|
| China | CN | 🇨🇳 |
| Hong Kong | HK | 🇭🇰 |
| India | IN | 🇮🇳 |
| Japan | JP | 🇯🇵 |
| South Korea | KR | 🇰🇷 |
| Taiwan | TW | 🇹🇼 |
| United Arab Emirates | AE | 🇦🇪 |
| United Kingdom | GB | 🇬🇧 |
| United States | US | 🇺🇸 |
| Australia | AU | 🇦🇺 |
| Germany | DE | 🇩🇪 |
| France | FR | 🇫🇷 |

## How to Add Flags to Conferences

When adding or editing a conference, simply include the `countryCode` field:

```javascript
{
    id: 7,
    name: "Bangkok International MUN",
    organization: "Chulalongkorn University",
    location: "Bangkok, Thailand",
    countryCode: "TH",  // ← Add this!
    startDate: "2024-05-10",
    endDate: "2024-05-14",
    // ... other fields
}
```

## Where Flags Appear

Flags automatically appear in:
- ✅ Conference cards on the main page (next to location)
- ✅ Conference detail pages (in the location info card)
- ✅ Both light and dark modes

## Technical Details

The system converts country codes to flag emojis using Unicode:
- Each flag is made of two Regional Indicator Symbol letters
- The formula: `127397 + character code` for each letter
- Example: "US" → 🇺 🇸 → 🇺🇸

### Code Implementation:
```javascript
function getCountryFlag(countryCode) {
    if (!countryCode || countryCode.length !== 2) return '';
    
    const codePoints = countryCode
        .toUpperCase()
        .split('')
        .map(char => 127397 + char.charCodeAt());
    
    return String.fromCodePoint(...codePoints);
}
```

## Important Notes

1. **Case Insensitive**: "us", "US", "Us" all work
2. **Two Letters Only**: Must be exactly 2 characters
3. **Standard Codes**: Use ISO 3166-1 alpha-2 codes
4. **Browser Support**: Works on all modern browsers
5. **Emoji Display**: Appearance varies by operating system

## Troubleshooting

### Flag not showing?
- Check the country code is exactly 2 letters
- Verify it's a valid ISO 3166-1 alpha-2 code
- Ensure the `countryCode` field is included in the conference object

### Wrong flag appearing?
- Double-check the country code
- Some territories have specific codes (e.g., Hong Kong is "HK", not "CN")

### Flag too small/large?
- Emoji size is controlled by font size
- Currently set to match the location text size

## Resources

- [ISO 3166-1 alpha-2 codes (Wikipedia)](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2)
- [Complete country code list](https://www.iso.org/iso-3166-country-codes.html)

## Examples in Sample Data

```javascript
// USA
{ countryCode: "US", location: "New York, USA" } // 🇺🇸

// UK
{ countryCode: "GB", location: "Oxford, UK" } // 🇬🇧

// Singapore
{ countryCode: "SG", location: "Singapore" } // 🇸🇬

// Thailand
{ countryCode: "TH", location: "Bangkok, Thailand" } // 🇹🇭

// Japan
{ countryCode: "JP", location: "Tokyo, Japan" } // 🇯🇵
```

---

**Quick Tip:** When adding a conference, just add the two-letter country code and the flag will automatically appear! 🎉






