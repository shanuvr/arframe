# React Conversion - Setup & Deployment Guide

## What Was Done

Your AFRAME Builders website has been successfully converted from static HTML to a modern React application with the following improvements:

### ✅ Completed Tasks

1. **Component Architecture**
   - Split monolithic HTML into 12 reusable React components
   - Each component has its own JSX file and dedicated CSS file
   - Components are modular, maintainable, and easy to extend

2. **File Structure**
   - `src/components/` - All React components organized by feature
   - `src/styles/global.css` - Shared styles and CSS variables
   - `src/App.jsx` - Main application component
   - `src/index.css` - Root level styles

3. **Styling System**
   - Global CSS variables for consistent theming
   - Responsive design with mobile-first approach
   - Modular CSS files for each component
   - Smooth animations and transitions

4. **Features Preserved**
   - All original HTML content and structure
   - Navigation with anchor links (#about, #design, #projects, #contact)
   - Contact form with state management
   - Responsive images and layouts
   - Google Maps integration
   - Social media links
   - All icons and styling

## Quick Start

### 1. Install Dependencies
```bash
cd "c:\MY FOLDER\AFRAME-Builders"
npm install
```

### 2. Run Development Server
```bash
npm run dev
```
This will start a local development server at `http://localhost:5173`

### 3. Build for Production
```bash
npm run build
```
Creates optimized production build in the `dist/` folder

### 4. Preview Production Build
```bash
npm run preview
```

## Project Structure

```
src/
├── components/
│   ├── Navbar/           - Navigation header
│   ├── Hero/             - Hero section with CTA
│   ├── About/            - Company info & stats
│   ├── Expertise/        - Services cards
│   ├── DesignExcellence/ - Process flow (dark section)
│   ├── FeaturedProjects/ - Projects gallery
│   ├── WhyChooseUs/      - Benefits section
│   ├── BeforeAfter/      - Transformations gallery
│   ├── Team/             - Team members
│   ├── Testimonials/     - Reviews & ratings
│   ├── Contact/          - Contact form & map
│   └── Footer/           - Footer section
├── styles/
│   └── global.css        - Shared styles & variables
├── App.jsx               - Main app component
├── App.css               - App styles
├── index.css             - Root styles
└── main.jsx              - React entry point
```

## Component Details

### Each Component Includes:
- **JSX File** - React component with props and state
- **CSS File** - Component-specific styles
- **Responsive Design** - Mobile, tablet, and desktop breakpoints
- **Accessibility** - Semantic HTML and proper ARIA attributes

### Key Components:

1. **Navbar** - Fixed navigation with smooth scrolling
2. **Hero** - Full-screen intro with gradient overlay
3. **About** - Statistics and company information
4. **Expertise** - 6 service cards with hover effects
5. **DesignExcellence** - 3-step process flow (dark theme)
6. **FeaturedProjects** - 3-project showcase
7. **WhyChooseUs** - 8 benefit cards
8. **BeforeAfter** - 4 transformation images
9. **Team** - 4 team members
10. **Testimonials** - Client reviews + Google rating
11. **Contact** - Form + Map + Address
12. **Footer** - Links + Contact info

## Customization Tips

### Change Colors
Edit `src/styles/global.css`:
```css
:root {
  --primary: #c5a059;        /* Change to your color */
  --primary-dark: #a48243;
  --dark: #111111;
  /* ... */
}
```

### Update Content
Edit individual component files (e.g., `src/components/Hero/Hero.jsx`):
```jsx
<h1>Your New Title</h1>
<p>Your new description</p>
```

### Add New Section
1. Create new folder: `src/components/YourComponent/`
2. Create `YourComponent.jsx` and `YourComponent.css`
3. Import in `src/App.jsx`
4. Add to render order in App.jsx

### Modify Navigation Links
Edit `src/components/Navbar/Navbar.jsx` and update anchor links

## Development Workflow

### Making Changes
1. Edit component JSX or CSS files
2. Changes auto-reload in browser (Hot Module Replacement)
3. No need to manually refresh

### Git Best Practices
```bash
# Create a new branch for features
git checkout -b feature/new-feature

# Commit changes
git add .
git commit -m "Add new feature description"

# Push to repository
git push origin feature/new-feature
```

## Deployment Options

### Option 1: Vercel (Recommended)
```bash
npm i -g vercel
vercel
# Follow the prompts to deploy
```

### Option 2: Netlify
```bash
npm i -g netlify-cli
netlify deploy --prod
```

### Option 3: GitHub Pages
1. Update `vite.config.js` with your repo name
2. Run `npm run build`
3. Deploy `dist/` folder to GitHub Pages

### Option 4: Traditional Server
1. Run `npm run build`
2. Upload `dist/` folder to your server
3. Configure server to serve `index.html` for all routes

## Troubleshooting

### Issue: Port 5173 already in use
```bash
npm run dev -- --port 3000
```

### Issue: Build fails
```bash
# Clear node_modules and reinstall
rm -r node_modules
npm install
npm run build
```

### Issue: Styles not applying
1. Check CSS file is imported in JSX
2. Verify class names match CSS
3. Check for typos in selectors

### Issue: Images not loading
1. Verify image URLs are correct
2. Check CORS settings for external images
3. Use relative paths for local images

## Performance Tips

1. **Lazy Load Images**
   - Consider using React.lazy() or Intersection Observer
   
2. **Optimize Images**
   - Compress images before upload
   - Use modern formats (WebP)
   
3. **Code Splitting**
   - Vite automatically splits chunks
   - Import heavy components dynamically

4. **Font Optimization**
   - Currently using Google Fonts
   - Consider self-hosting for better performance

## SEO Optimization

1. **Meta Tags** - Update in `index.html`
```html
<meta name="description" content="Your description">
<meta name="keywords" content="your, keywords">
```

2. **Open Graph Tags** - Add for social sharing
```html
<meta property="og:title" content="Title">
<meta property="og:image" content="image-url">
```

3. **Structured Data** - Add schema markup
```html
<script type="application/ld+json">
  {/* Your schema */}
</script>
```

## Support & Documentation

- **React Docs**: https://react.dev
- **Vite Docs**: https://vitejs.dev
- **CSS Variables**: https://developer.mozilla.org/en-US/docs/Web/CSS/--*
- **FontAwesome**: https://fontawesome.com/docs

## Next Steps

1. ✅ Install dependencies
2. ✅ Run `npm run dev`
3. ✅ Test all sections in browser
4. ✅ Customize content and colors
5. ✅ Deploy to production

## Folder Structure Summary

```
AFRAME-Builders/
├── src/
│   ├── components/     (12 component folders)
│   ├── styles/         (global.css)
│   ├── App.jsx         ✅ Main component
│   ├── App.css
│   ├── index.css
│   └── main.jsx
├── public/             (static assets)
├── index.html          ✅ Updated with fonts/icons
├── package.json
├── vite.config.js
├── eslint.config.js
├── REACT_STRUCTURE.md  📄 Detailed docs
├── SETUP_GUIDE.md      📄 This file
└── README.md
```

---

**Ready to get started?** Run `npm install` then `npm run dev` 🚀
