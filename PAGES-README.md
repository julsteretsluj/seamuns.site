# SEAMUNs Website - Multi-Page Structure

## Overview
The website has been restructured into separate pages for better organization and navigation.

## Created Pages

### ✅ Core Pages (Already Created)
1. **index.html** - Main conferences page with all registered MUNs
2. **prospective-muns.html** - Prospective conferences
3. **contact.html** - Contact information
4. **mun-guide.html** - Comprehensive MUN guide

## Remaining Pages to Create

### To Generate All Remaining Pages:

A Python script `generate_pages.py` has been created in the project root. To generate all remaining pages, run:

```bash
cd /Users/juleskitto-astrop/mun-tracker
python3 generate_pages.py
```

This will create 24 additional pages:
- how-to-host.html
- participating-schools.html
- become-participating-school.html
- delegate-signup.html
- individual-delegates.html
- how-to-prep.html
- stand-out.html
- confidence.html
- support.html
- chair-guide.html
- advisor-guide.html
- points.html
- motions.html
- committees.html
- conduct.html
- speeches.html
- resolutions.html
- crisis.html
- ga.html
- position-papers.html
- examples.html
- awards.html
- templates.html

## Page Structure

Each page includes:
- ✨ **Consistent header** with SEAMUNs branding
- 🎯 **Full navigation menu** (same on all pages)
- 🔐 **Login/Signup functionality** (shared across all pages)
- 🌓 **Dark mode toggle** (synced via localStorage)
- 📱 **Responsive design** (mobile-friendly)
- 🎨 **Glassmorphic styling** (modern aesthetic)

## Navigation Features

- **Dropdown menus** organize content by category
- **Smooth scrolling** for in-page navigation
- **Hover effects** with 100ms close delay
- **Mobile responsive** with touch-friendly interface
- **Active state management** for current page

## User Experience

- All pages share the same authentication system
- Login state persists across pages
- Theme preference (light/dark) saved globally
- Conference data accessible from any page (via index.html)

## Development Notes

### Adding Content to Pages

Each generated page has placeholder content with:
```html
<section class="content-section">
    <h2><i class="icon"></i> Page Title</h2>
    <p>Description text</p>
    
    <div class="info-box">
        <h3>Content Coming Soon</h3>
        <p>Placeholder text</p>
    </div>
</section>
```

Simply replace the placeholder content with actual information.

### Customizing the Generate Script

Edit `generate_pages.py` to:
- Change page titles
- Update descriptions
- Modify icons
- Add custom content

### Styling

All pages use the same `styles.css` file, ensuring consistent:
- Colors and themes
- Typography
- Spacing and layout
- Animations and transitions

## File Organization

```
mun-tracker/
├── index.html (Main page - conferences)
├── prospective-muns.html
├── contact.html
├── mun-guide.html
├── [22 more HTML files to be generated]
├── styles.css (Shared stylesheet)
├── script.js (Shared JavaScript)
├── generate_pages.py (Page generator script)
└── README.md (This file)
```

## Next Steps

1. Run the Python script to generate remaining pages
2. Add actual content to each page
3. Test all navigation links
4. Verify login/signup works across pages
5. Test mobile responsiveness
6. Add actual conference data
7. Implement search functionality across pages

## Benefits of Multi-Page Structure

✅ **Better SEO** - Each page can be optimized for specific keywords
✅ **Faster Loading** - Each page loads only what it needs
✅ **Easier Maintenance** - Content organized by topic
✅ **Better UX** - Clear navigation and structure
✅ **Scalability** - Easy to add more pages
✅ **Sharing** - Each page has its own URL

## Technical Details

- **HTML5** semantics
- **CSS3** with custom properties (variables)
- **Vanilla JavaScript** (no frameworks)
- **LocalStorage** for data persistence
- **Responsive** grid and flexbox layouts
- **Font Awesome** icons
- **Google Fonts** (SF Pro Display style)

---

For questions or support, visit contact.html or email contact@seamuns.org


