# MUN Conference Tracker

A modern, responsive web application for tracking Model United Nations (MUN) conferences worldwide. Built with vanilla HTML, CSS, and JavaScript.

## Features

### 🎯 Core Functionality
- **Conference Management**: Add, edit, and delete MUN conferences
- **Smart Filtering**: Filter by status (upcoming/previous) and location
- **Real-time Search**: Search conferences by name, organization, or location
- **Statistics Dashboard**: View counts of upcoming, previous, and total conferences
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices

### 🎨 User Interface
- **Modern Design**: Beautiful gradient backgrounds and glassmorphism effects
- **Interactive Cards**: Hover effects and smooth animations
- **Modal Dialogs**: Clean forms for adding/editing conferences
- **Status Indicators**: Visual indicators for upcoming vs previous conferences
- **Font Awesome Icons**: Professional iconography throughout

### 💾 Data Management
- **Local Storage**: All data persists in browser localStorage
- **Sample Data**: Pre-loaded with 6 sample MUN conferences
- **Data Validation**: Form validation and date checking
- **Export Ready**: Easy to extend with data export functionality

## Getting Started

### Prerequisites
- A modern web browser (Chrome, Firefox, Safari, Edge)
- No server required - runs entirely in the browser

### Installation
1. Download or clone the project files
2. Copy `env.example.js` to `env.js` and insert your Firebase credentials (keep `env.js` private)
3. Open `index.html` in your web browser
4. Start tracking MUN conferences!

### File Structure
```
mun-tracker/
├── index.html          # Main HTML file
├── styles.css          # CSS styles and responsive design
├── script.js           # JavaScript functionality
└── README.md           # This file
```

## Usage

### Adding a Conference
1. Click the "Add Conference" button
2. Fill in the required fields:
   - Conference Name
   - Organization
   - Location
   - Start Date
   - End Date
3. Optionally add:
   - Description
   - Website URL
   - Registration Deadline
4. Click "Save Conference"

### Viewing Conference Details
- Click on any conference card to view full details
- Use the "View Details" button for the same functionality

### Editing a Conference
1. Open conference details
2. Click "Edit" button
3. Modify the information
4. Click "Save Conference"

### Filtering and Searching
- **Search Bar**: Type to search by name, organization, or location
- **Status Filter**: Choose "All", "Upcoming", or "Previous"
- **Location Filter**: Filter by specific locations

### Deleting a Conference
1. Open conference details
2. Click "Delete" button
3. Confirm deletion

## Sample Data

The application comes pre-loaded with 6 sample MUN conferences:

1. **Harvard WorldMUN 2024** - New York, USA (Upcoming)
2. **Oxford International MUN** - Oxford, UK (Upcoming)
3. **Singapore Model UN** - Singapore (Upcoming)
4. **Berlin International MUN** - Berlin, Germany (Previous)
5. **Tokyo Global MUN** - Tokyo, Japan (Previous)
6. **Dubai International MUN** - Dubai, UAE (Previous)

## Technical Details

### Technologies Used
- **HTML5**: Semantic markup and modern form elements
- **CSS3**: Flexbox, Grid, animations, and responsive design
- **JavaScript ES6+**: Classes, arrow functions, and modern syntax
- **Font Awesome**: Professional icons
- **Local Storage API**: Data persistence

### Browser Compatibility
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

### Performance Features
- Efficient DOM manipulation
- Event delegation for better performance
- Responsive images and optimized CSS
- Minimal external dependencies

## Customization

### Adding New Fields
To add new conference fields:
1. Update the HTML form in `index.html`
2. Modify the JavaScript `addConference()` method
3. Update the rendering functions
4. Add corresponding CSS styles

### Styling Changes
- Modify `styles.css` for visual changes
- CSS custom properties (variables) can be added for easy theming
- Responsive breakpoints can be adjusted

### Data Export
The application stores data in localStorage. To export:
```javascript
// In browser console
JSON.stringify(JSON.parse(localStorage.getItem('munConferences')))
```

## Future Enhancements

Potential features for future versions:
- Data import/export (CSV, JSON)
- Calendar view
- Email notifications
- Conference categories/tags
- User accounts and sharing
- Mobile app version
- Integration with conference APIs

## Contributing

This is a demonstration project. Feel free to fork and modify for your own use or to contribute improvements.

## License

This project is open source and available under the MIT License.
# seamuns.site
