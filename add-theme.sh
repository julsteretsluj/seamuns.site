#!/bin/bash

# Theme selector HTML to add
THEME_SELECTOR='
    <!-- Theme Color Selector -->
    <div class="theme-selector" id="themeSelector">
        <span class="theme-selector-label">Theme</span>
        <div class="color-swatch" data-color="red" title="Red Theme"></div>
        <div class="color-swatch" data-color="orange" title="Orange Theme"></div>
        <div class="color-swatch" data-color="yellow" title="Yellow Theme"></div>
        <div class="color-swatch" data-color="green" title="Green Theme"></div>
        <div class="color-swatch active" data-color="blue" title="Blue Theme"></div>
        <div class="color-swatch" data-color="purple" title="Purple Theme"></div>
        <div class="color-swatch" data-color="pink" title="Pink Theme"></div>
        <div class="color-swatch" data-color="grey" title="Grey Theme"></div>
        <div class="color-swatch" data-color="mono" title="Monochrome Theme"></div>
    </div>
'

# List of HTML files to update
FILES="prospective-muns.html participating-schools.html become-participating-school.html delegate-signup.html individual-delegates.html mun-guide.html how-to-prep.html stand-out.html confidence.html support.html chair-guide.html advisor-guide.html points.html motions.html committees.html speeches.html resolutions.html crisis.html ga.html position-papers.html examples.html awards.html templates.html contact.html"

for file in $FILES; do
    if [ -f "$file" ]; then
        # Check if theme-selector already exists
        if grep -q "theme-selector" "$file"; then
            echo "✓ $file already has theme selector"
        else
            # Create a temp file with the theme selector added
            awk '
                /<div class="theme-toggle"/ {
                    print
                    getline
                    while (getline && !/<\/div>/) print
                    print
                    print ""
                    print "    <!-- Theme Color Selector -->"
                    print "    <div class=\"theme-selector\" id=\"themeSelector\">"
                    print "        <span class=\"theme-selector-label\">Theme</span>"
                    print "        <div class=\"color-swatch\" data-color=\"red\" title=\"Red Theme\"></div>"
                    print "        <div class=\"color-swatch\" data-color=\"orange\" title=\"Orange Theme\"></div>"
                    print "        <div class=\"color-swatch\" data-color=\"yellow\" title=\"Yellow Theme\"></div>"
                    print "        <div class=\"color-swatch\" data-color=\"green\" title=\"Green Theme\"></div>"
                    print "        <div class=\"color-swatch active\" data-color=\"blue\" title=\"Blue Theme\"></div>"
                    print "        <div class=\"color-swatch\" data-color=\"purple\" title=\"Purple Theme\"></div>"
                    print "        <div class=\"color-swatch\" data-color=\"pink\" title=\"Pink Theme\"></div>"
                    print "        <div class=\"color-swatch\" data-color=\"grey\" title=\"Grey Theme\"></div>"
                    print "        <div class=\"color-swatch\" data-color=\"mono\" title=\"Monochrome Theme\"></div>"
                    print "    </div>"
                    next
                }
                { print }
            ' "$file" > "$file.tmp" && mv "$file.tmp" "$file"
            echo "✓ Added theme selector to $file"
        fi
    fi
done

echo "Done!"











