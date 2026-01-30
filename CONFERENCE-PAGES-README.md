# Conference Detail Pages - Implementation Guide

## 🎯 Overview

Each conference now has its own dedicated detail page with comprehensive information including contact details, committees, accessibility information, and more.

## 📋 Conference Information Fields

Each conference page displays:

### Basic Information
- **Conference Name**
- **School / Organization**
- **Location**
- **Dates** (Start and End Date)
- **Size** (e.g., "100-300 attendees")
- **Price Per Delegate** (e.g., "1000 THB")

### Contact Information
- **General Email**
- **MUN Account** (Social media handle)
- **Advisor Account** (Contact for advisors)
- **Secretary General Accounts**
- **Parliamentarian Accounts**

### Conference Details
- **Committees** (List of all committees)
- **Unique Topics** (Special or innovative topics being addressed)
- **Chairs & Pages** (Information about committee chairs)
- **Allocations Present** (Countries/entities for research - not chosen by delegates)

### Awards & Recognition
- **Available Awards** (Types of awards offered)
- **Previous Award Winners** (If applicable)

### Registration
- **Independent Delegates Welcome?** (Yes/No)
- **Sign Up for Independent Delegates** (Link if available)
- **Sign Up for Advisors** (Registration link for schools)

### Accessibility
- **Suitable for Disabled Individuals?** (Yes/No with details)
- **Suitable for Sensory Sensitive Individuals?** (Yes/No with details)

### Additional Information
- **Campus / Venue Guide** (Directions and venue details)
- **Schedule** (Conference timeline)
- **Extra Notes** (Any additional important information)

## 🏗️ Technical Implementation

### Files Created

1. **conference-template.html** - Template for all conference detail pages
2. **conference-detail.js** - JavaScript to populate conference details
3. **Updated styles.css** - Styles for conference detail pages
4. **Updated script.js** - Modified to link to detail pages

### How It Works

1. **Conference Cards** on index.html now link to detail pages:
   ```html
   <a href="conference-template.html?id=1">View Details</a>
   ```

2. **conference-detail.js** reads the conference ID from the URL:
   ```javascript
   const urlParams = new URLSearchParams(window.location.search);
   const id = urlParams.get('id');
   ```

3. **Data is loaded** from localStorage and populated into the page

4. **Attendance tracking** works on individual pages for logged-in users

## 📝 Adding New Conference Data

When adding a conference, include all fields in the conference object:

```javascript
{
    id: 1,
    name: "Conference Name",
    organization: "School/Organization",
    location: "City, Country",
    startDate: "2024-03-15",
    endDate: "2024-03-19",
    description: "Brief description",
    status: "upcoming", // or "previous"
    
    // Detailed Information
    size: "100-300 attendees",
    pricePerDelegate: "1000 THB",
    generalEmail: "info@conference.org",
    munAccount: "@ConferenceMUN",
    advisorAccount: "advisors@conference.org",
    secGenAccounts: "secgen@conference.org",
    parliamentarianAccounts: "parl@conference.org",
    
    // Independent Delegates
    independentDelsWelcome: true, // or false
    independentSignupLink: "https://...", // if applicable
    advisorSignupLink: "https://...",
    
    // Committees & Topics
    committees: ["Committee 1", "Committee 2", "..."],
    uniqueTopics: ["Topic 1", "Topic 2", "..."],
    chairsPages: "<p>Chair information HTML...</p>",
    allocations: ["Country 1", "Country 2", "..."],
    
    // Awards
    availableAwards: ["Best Delegate", "Outstanding", "..."],
    previousWinners: ["Name - Award 2023", "..."],
    
    // Accessibility
    disabledSuitable: true, // or false
    sensorySuitable: true, // or false
    
    // Additional Info
    schedule: "<p>Schedule HTML...</p>",
    venueGuide: "<p>Venue information HTML...</p>",
    extraNotes: "<p>Additional notes HTML...</p>"
}
```

## 🎨 Page Layout

### Header Section
- Large conference title
- Status badge (Upcoming/Previous)
- Size badge

### Quick Info Cards (4 cards)
- Organization
- Location
- Date
- Price

### Main Content (Two-column layout)

**Left Column (Main Content):**
- Contact Information
- Committees
- Unique Topics
- Chairs & Pages
- Allocations
- Awards
- Schedule

**Right Sidebar:**
- Independent Delegates Info
- Advisor Sign Up
- Accessibility Information
- Venue Guide
- Extra Notes
- Action Buttons (Back, Mark Attendance)

## 🔧 Customization

### To modify the template:
Edit `conference-template.html`

### To change styling:
Update the conference detail styles in `styles.css` (search for "Conference Detail Pages")

### To modify data loading:
Edit `conference-detail.js`

## 📱 Responsive Design

The conference detail pages are fully responsive:
- **Desktop:** Two-column layout
- **Tablet:** Two-column adjusts
- **Mobile:** Single column stacked layout

## ✅ Features

- ✨ **Beautiful Design** - Glassmorphic styling throughout
- 🔐 **Login Integration** - Attendance tracking requires login
- 📊 **Comprehensive Info** - All necessary details in one place
- ♿ **Accessibility Info** - Clear accessibility information
- 📱 **Mobile Friendly** - Works on all devices
- 🔗 **Easy Navigation** - Link back to main conference list
- 💾 **Data Persistence** - All data stored in localStorage

## 🚀 Usage

### For Visitors:
1. Browse conferences on main page (index.html)
2. Click "View Details" on any conference
3. View comprehensive conference information
4. Sign up if independent delegates welcome
5. Mark attendance (if logged in)

### For Admins:
1. Add conference data to localStorage
2. Include all required fields
3. HTML formatting allowed in text fields (schedule, notes, etc.)
4. Preview the conference page
5. Test all links and functionality

## 🔮 Future Enhancements

Potential additions:
- [ ] Export conference details to PDF
- [ ] Share conference page on social media
- [ ] Add conference to calendar (ICS file)
- [ ] Email conference details
- [ ] Print-friendly version
- [ ] Conference comparison tool
- [ ] Advanced filtering on detail pages

## 📞 Support

For questions about the conference detail page system:
- Check the code comments in conference-detail.js
- Review the template structure in conference-template.html
- Test with sample data provided

---

**Last Updated:** October 12, 2025  
**Status:** ✅ Fully Operational






