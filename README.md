# Nehme AI Labs Landing Page

A minimalist, authoritative single-page website for Nehme AI Labs - an elite boutique consultancy specializing in architectural interventions for AI stacks.

## Design Philosophy

**Ruthless Efficiency.** This website embodies the brand's core identity: minimalist, authoritative, and brutally direct. It functions as a weapon, not a welcome mat - filtering out unqualified prospects while compelling high-value clients.

## Features

- **Single-page scrolling design** with 6 distinct sections
- **Monochromatic dark theme** (#111111 background, white/electric blue accents)
- **Subtle scroll animations** using Intersection Observer API
- **Abstract neural network visualizations** in the hero section
- **Responsive design** optimized for mobile, tablet, and desktop
- **Contact form** with mailto integration
- **Vanilla JavaScript** - no dependencies, fast loading

## File Structure

```
nehmeailabs.com/
├── index.html      # Main HTML structure
├── styles.css      # All styling and responsive design
├── script.js       # Scroll animations and form handling
└── README.md       # This file
```

## Setup

1. Clone or download this repository
2. Open `index.html` in a web browser
3. For local development, use a local server:
   ```bash
   python -m http.server 8000
   ```
   Then visit `http://localhost:8000`

## Customization

### Adding Your Headshot

Place your professional headshot image at:
```
images/headshot.jpg
```

The image will automatically be converted to grayscale via CSS. Recommended dimensions: 600x600px or larger (square aspect ratio preferred).

### Updating Content

Edit the HTML directly in `index.html`:
- Section headlines and copy
- Social proof bullet points
- Contact email address

### Color Scheme

Modify colors in `styles.css`:
- Background: `#111111`
- Primary text: `#FFFFFF`
- Accent: `#00BFFF`
- Borders/dividers: `#333333`

### Typography

The site uses Inter font from Google Fonts. To change fonts, update:
1. The Google Fonts link in `index.html`
2. The `font-family` declarations in `styles.css`

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Performance

- No external JavaScript dependencies
- Optimized CSS animations
- Lazy loading ready for images
- Fast initial page load

## Deployment

This is a static site and can be deployed to any hosting service:
- Netlify
- Vercel
- GitHub Pages
- AWS S3 + CloudFront
- Any static hosting provider

Simply upload all files to your hosting service.

## License

Proprietary - Nehme AI Labs

