# AFRAME Builders - React Architecture

This is the React implementation of the AFRAME Builders website, converted from the original HTML/CSS design.

## Project Structure

```
src/
├── components/
│   ├── Navbar/
│   │   ├── Navbar.jsx       # Navigation bar component
│   │   └── Navbar.css       # Navigation styles
│   ├── Hero/
│   │   ├── Hero.jsx         # Hero section with gradient background
│   │   └── Hero.css         # Hero styles
│   ├── About/
│   │   ├── About.jsx        # About section with stats grid
│   │   └── About.css        # About styles
│   ├── Expertise/
│   │   ├── Expertise.jsx    # Services/expertise cards
│   │   └── Expertise.css    # Expertise styles
│   ├── DesignExcellence/
│   │   ├── DesignExcellence.jsx    # Design process section
│   │   └── DesignExcellence.css    # Design excellence styles
│   ├── FeaturedProjects/
│   │   ├── FeaturedProjects.jsx    # Featured projects grid
│   │   └── FeaturedProjects.css    # Projects styles
│   ├── WhyChooseUs/
│   │   ├── WhyChooseUs.jsx  # Benefits section
│   │   └── WhyChooseUs.css  # Benefits styles
│   ├── BeforeAfter/
│   │   ├── BeforeAfter.jsx  # Before & after gallery
│   │   └── BeforeAfter.css  # Before & after styles
│   ├── Team/
│   │   ├── Team.jsx         # Team members section
│   │   └── Team.css         # Team styles
│   ├── Testimonials/
│   │   ├── Testimonials.jsx # Client reviews & ratings
│   │   └── Testimonials.css # Testimonials styles
│   ├── Contact/
│   │   ├── Contact.jsx      # Contact form & map
│   │   └── Contact.css      # Contact styles
│   └── Footer/
│       ├── Footer.jsx       # Footer section
│       └── Footer.css       # Footer styles
├── styles/
│   └── global.css           # Global styles, variables, and utilities
├── App.jsx                  # Main app component
├── App.css                  # App-level styles
├── index.css                # Root styles
├── main.jsx                 # React entry point
└── index.html              # HTML template
```

## Components Overview

### 1. **Navbar Component**
   - Fixed navigation bar with logo and links
   - Links to different sections via anchor IDs
   - Responsive navigation

### 2. **Hero Component**
   - Full-screen hero section with background image
   - Features a large heading and CTA buttons
   - Includes scroll down indicator

### 3. **About Component**
   - Company information and mission
   - Statistics grid (Founded, Engineers, Staff, Projects)
   - Responsive image placement

### 4. **Expertise Component**
   - Grid of 6 service cards
   - Hover effects with image scaling
   - Icons and service descriptions

### 5. **DesignExcellence Component**
   - Dark section with design process flow
   - 3-step process (Consultation, Design, Construction)
   - Visual cards for process demonstration

### 6. **FeaturedProjects Component**
   - Grid of featured projects
   - Project images with hover effects
   - Project details and location info

### 7. **WhyChooseUs Component**
   - 8 reason cards in a grid layout
   - Icons representing each benefit
   - Light background section

### 8. **BeforeAfter Component**
   - 4 transformation cards
   - Images and descriptions
   - Dark background with light text

### 9. **Team Component**
   - Team member cards with icons
   - Name and role display
   - Workforce information

### 10. **Testimonials Component**
   - Client review cards
   - Google rating box
   - Star ratings and review text

### 11. **Contact Component**
   - Contact form with multiple fields
   - Address and office information
   - Google Maps iframe
   - Social media icons

### 12. **Footer Component**
   - Footer grid with company info
   - Quick links and services
   - Contact information
   - Footer bottom with copyright

## Styling Architecture

### Global Styles (`src/styles/global.css`)
- CSS variables for colors and fonts
- Global button styles (.btn-gold, .btn-outline, .btn-outline-dark)
- Reset styles
- Responsive breakpoints and media queries

### Component Styles
Each component has its own CSS file with:
- Component-specific styling
- Responsive design breakpoints
- Hover and interaction states
- Animations (e.g., bounce effect)

## Key Features

✅ **Modular Components** - Each section is a separate, reusable React component
✅ **Separate CSS Files** - Every component has its own CSS file for easy maintenance
✅ **Responsive Design** - Mobile-first approach with breakpoints at 992px and 576px
✅ **Global Variables** - Centralized color scheme and typography
✅ **Interactive Elements** - Hover effects, smooth scrolling, and animations
✅ **Form Handling** - Contact form with state management
✅ **Modern Stack** - React + Vite for fast development

## Colors & Theme

- **Primary Gold**: #c5a059
- **Primary Dark**: #a48243
- **Dark**: #111111
- **Dark Light**: #1a1a1a
- **Light**: #f9f9f9
- **Text Dark**: #222222
- **Text Muted**: #666666

## Typography

- **Heading Font**: Marcellus (serif)
- **Body Font**: Plus Jakarta Sans (sans-serif)
- **Icon Library**: FontAwesome 6.4.0

## Responsive Breakpoints

- **Desktop**: 992px and above
- **Tablet**: 768px - 991px
- **Mobile**: Below 576px

## Running the Project

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Customization Guide

### Adding a New Section
1. Create a new folder in `src/components/`
2. Create component JSX file
3. Create corresponding CSS file
4. Import component in `App.jsx`
5. Add component to the main render

### Modifying Colors
Edit the CSS variables in `src/styles/global.css`:
```css
:root {
  --primary: #your-color;
  --primary-dark: #your-color-dark;
  /* ... */
}
```

### Adding Navigation Links
Edit the Navbar component in `src/components/Navbar/Navbar.jsx` and add section IDs to relevant components.

## Performance Optimization

- Images use Unsplash URLs with lazy loading
- CSS is scoped to components for better performance
- Minimal re-renders with functional components
- CSS animations use GPU-accelerated transforms

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Android)

## Future Enhancements

- [ ] Add page transitions
- [ ] Implement image optimization with Next Image
- [ ] Add animation library (Framer Motion)
- [ ] Create admin dashboard for content management
- [ ] Add dark mode support
- [ ] Implement E-commerce features
- [ ] Add multi-language support

## Notes

- The original HTML file is preserved as `AFRAME-Original.html` for reference
- All component data is currently hardcoded but can be moved to a CMS
- Form submission needs backend integration
- Google Maps API key may need updating

