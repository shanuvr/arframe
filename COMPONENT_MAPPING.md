# Component Mapping Guide

This document maps the original HTML sections to the new React components.

## Original HTML → React Components

### 1. Navigation & Header
**Original**: `<nav class="navbar">` inside `<header class="hero">`
**New Components**: 
- `Navbar.jsx` - Fixed navigation bar
- `Hero.jsx` - Hero section (includes Navbar)

**Changes**:
- Navbar is now a separate, reusable component
- Navigation links use anchor IDs for smooth scrolling
- Logo component is within Navbar

---

### 2. About Section
**Original**: `<section class="container grid-2">` (About AFRAME)
**New Component**: `About.jsx`

**Features**:
```jsx
- Company image (left side)
- Company info and mission (right side)
- Stats grid: Founded, Engineers, Staff, Projects
- "Read More About Us" button
```

**Props/Data**:
```jsx
const stats = [
  { number: '2020', label: 'Founded' },
  { number: '15+', label: 'Engineers' },
  { number: '100+', label: 'Skilled Staff' },
  { number: '50+', label: 'Completed' },
];
```

---

### 3. Our Expertise / Services
**Original**: `<section class="expertise-section">`
**New Component**: `Expertise.jsx`

**Features**:
```jsx
- 6 service cards in a grid
- Each card has image + icon + title
- Hover effects with image scaling
- Services: Residential, Commercial, Architecture, Interior, Renovation, Management
```

**Services Array**:
```jsx
const services = [
  {
    img: '...',
    icon: 'fa-solid fa-house',
    title: 'Residential Construction',
  },
  // ... 5 more services
];
```

---

### 4. Design Excellence (Dark Section)
**Original**: `<section class="dark-section">`
**New Component**: `DesignExcellence.jsx`

**Features**:
```jsx
- Dark background section
- Left: Process description + 3-step flow (Consultation, Design, Construction)
- Right: 3 visual cards (Concept, 3D, Finished)
- Step icons with circular borders
```

**Data Arrays**:
```jsx
const processSteps = [
  { number: '01', label: 'Consultation' },
  { number: '02', label: 'Design' },
  { number: '03', label: 'Construction' },
];

const visualCards = [
  { img: '...', title: 'Concept Sketch' },
  { img: '...', title: '3D Visualization' },
  { img: '...', title: 'Finished Project' },
];
```

---

### 5. Featured Projects
**Original**: `<section class="container">` with projects-grid
**New Component**: `FeaturedProjects.jsx`

**Features**:
```jsx
- Section header with "View All Projects" link
- 3 project cards in a grid
- Each card: image + title + location
- Hover effects on images
```

**Projects Data**:
```jsx
const projects = [
  {
    img: '...',
    title: 'Contemporary Residence',
    location: 'Thrissur, Kerala | 3000 Sq.Ft',
  },
  // ... 2 more projects
];
```

---

### 6. Why Choose Us / Benefits
**Original**: `<section class="why-section text-center">`
**New Component**: `WhyChooseUs.jsx`

**Features**:
```jsx
- 8 benefit items in a grid (4 columns)
- Each item: Icon + Title
- Icons from FontAwesome
- Light background
```

**Benefits Data**:
```jsx
const reasons = [
  { icon: 'fa-solid fa-user-tie', title: 'Professional Engineers' },
  { icon: 'fa-solid fa-users', title: '100+ Skilled Workforce' },
  // ... 6 more benefits
];
```

---

### 7. Before & After Transformations
**Original**: `<section class="ba-section">`
**New Component**: `BeforeAfter.jsx`

**Features**:
```jsx
- Dark background with light text
- 4 transformation cards in a grid
- Each card: Image + Title
- Responsive layout
```

**Transformations Data**:
```jsx
const transformations = [
  { img: '...', title: 'Old House Renovation' },
  { img: '...', title: 'Empty Plot To Luxury Villa' },
  { img: '...', title: 'Structure To Completion' },
  { img: '...', title: 'Interior Transformation' },
];
```

---

### 8. Our Team
**Original**: `<section class="container text-center">` (Our Professional Team)
**New Component**: `Team.jsx`

**Features**:
```jsx
- Team section title
- 4 team member cards
- Each card: Icon + Name + Role
- Workforce note at bottom
```

**Team Data**:
```jsx
const teamMembers = [
  { name: 'Rajeev K R', role: 'Founder & Proprietor' },
  { name: 'Dileep K', role: 'Principal Architect' },
  { name: 'Aiswarya Manoj', role: 'Project Manager' },
  { name: 'Prasad K M', role: 'Project Manager' },
];
```

---

### 9. Testimonials & Google Rating
**Original**: `<section class="container">` (What Our Clients Say)
**New Component**: `Testimonials.jsx`

**Features**:
```jsx
- Section with testimonials on left
- Google rating box on right
- 2 review cards in reviews container
- Rating box with stars and score
```

**Testimonials Data**:
```jsx
const reviews = [
  {
    text: '"Aframe Builders turned our dream home..."',
    name: 'Shibin K',
    location: 'Thrissur',
  },
  // ... 1 more review
];
```

---

### 10. Contact Form & Address
**Original**: `<section class="footer-cta-section">`
**New Component**: `Contact.jsx`

**Features**:
```jsx
- Left: Contact form with fields
  - Name, Phone, Email, Service dropdown, Message
  - Form state management
  - Submit handler
- Right: Address section + Map
  - Office address
  - Contact info (phone, email, hours)
  - Social media icons
  - Google Maps iframe
```

**Form State**:
```jsx
const [formData, setFormData] = useState({
  name: '',
  phone: '',
  email: '',
  service: 'Residential Construction',
  message: '',
});
```

**Address Data** (hardcoded):
```jsx
Lakshmi Tower, Parayil Lane,
MG Road, Thrissur, Kerala - 680004
+91 9712337226
aframebuilders.ind@gmail.com
Mon - Sat: 9:00 AM - 6:00 PM
```

---

### 11. Footer
**Original**: `<footer>` section
**New Component**: `Footer.jsx`

**Features**:
```jsx
- Footer brand section with logo
- 3 footer columns:
  1. Quick Links
  2. Our Services
  3. Contact Info
- Footer bottom with copyright
```

**Footer Data**:
```jsx
const quickLinks = [
  { label: 'Home', href: '#' },
  { label: 'About Us', href: '#about' },
  // ...
];

const services = [
  { label: 'Residential', href: '#' },
  { label: 'Commercial', href: '#' },
  // ...
];
```

---

### 12. Global Styles
**Original**: `<style>` tag in HTML with CSS variables
**New Structure**:
- `src/styles/global.css` - Shared variables and utilities
- `src/App.css` - Main app styles
- `src/index.css` - Root styles
- Each component has its own `.css` file

**CSS Variables** (in global.css):
```css
:root {
  --primary: #c5a059;           /* Gold */
  --primary-dark: #a48243;      /* Dark Gold */
  --dark: #111111;              /* Very Dark */
  --dark-light: #1a1a1a;        /* Dark */
  --light: #f9f9f9;             /* Off White */
  --text-dark: #222222;         /* Text */
  --text-muted: #666666;        /* Muted Text */
  --font-heading: 'Marcellus', serif;
  --font-body: 'Plus Jakarta Sans', sans-serif;
  --transition: all 0.3s ease;
}
```

---

## File-by-File Changes

### Navigation Flow
```
App.jsx (Main Component)
  ├── Hero (includes Navbar)
  ├── About
  ├── Expertise
  ├── DesignExcellence
  ├── FeaturedProjects
  ├── WhyChooseUs
  ├── BeforeAfter
  ├── Team
  ├── Testimonials
  ├── Contact
  └── Footer
```

### CSS Cascade
```
1. index.css - Root styles and resets
2. global.css - Variables and utilities
3. App.css - App-level styles
4. Component CSS files - Component-specific styles
   ├── Navbar.css
   ├── Hero.css
   ├── About.css
   ├── Expertise.css
   ├── DesignExcellence.css
   ├── FeaturedProjects.css
   ├── WhyChooseUs.css
   ├── BeforeAfter.css
   ├── Team.css
   ├── Testimonials.css
   ├── Contact.css
   └── Footer.css
```

---

## Responsive Breakpoints

All components follow these breakpoints:
```css
/* Desktop */
Default styles (1240px max-width)

/* Tablet */
@media (max-width: 992px)
- Single column layouts
- Adjusted padding/margins
- Stack elements vertically

/* Mobile */
@media (max-width: 576px)
- Smaller fonts
- Further layout adjustments
- Touch-friendly spacing
```

---

## State Management

### Components with State:
1. **Contact.jsx** - Form data state
   ```jsx
   const [formData, setFormData] = useState({...})
   ```

### Props Flow:
- All components receive data as local variables (no prop drilling yet)
- Easy to convert to context API or Redux if needed

---

## Future Enhancements

### Easy Additions:
- Add dynamic content from CMS
- Implement authentication for admin panel
- Add email notifications for form submissions
- Create gallery lightbox for project images
- Add animation library (Framer Motion)
- Implement dark mode toggle

### Moderate Changes:
- Move data to separate config files
- Use context API for shared state
- Add routing for multiple pages
- Implement lazy loading for images

### Advanced:
- Integrate with backend API
- Add e-commerce functionality
- Implement real-time notifications
- Create admin dashboard

---

## Migration Notes

✅ **Preserved**:
- All HTML structure
- All CSS styling
- All functionality
- All content
- All images and links
- Responsive behavior
- Animations

✨ **Improved**:
- Modular architecture
- Reusable components
- Easier maintenance
- Better code organization
- Scalable structure
- Hot reload development

🚀 **Ready for**:
- Dynamic content
- API integration
- State management
- Routing
- Advanced features

