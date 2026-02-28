# Design System Documentation

## Overview
Modern design system with Inter font and comprehensive CSS design tokens for consistent styling across the application.

## Typography

### Font Family
- **Primary**: Inter (Google Fonts)
- **Fallback**: System fonts (-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, etc.)
- **Monospace**: SF Mono, Monaco, Inconsolata, Fira Code

### Font Sizes
```css
--font-size-xs: 0.75rem;     /* 12px */
--font-size-sm: 0.875rem;    /* 14px */
--font-size-base: 1rem;      /* 16px */
--font-size-lg: 1.125rem;    /* 18px */
--font-size-xl: 1.25rem;     /* 20px */
--font-size-2xl: 1.5rem;     /* 24px */
--font-size-3xl: 1.875rem;   /* 30px */
--font-size-4xl: 2.25rem;    /* 36px */
--font-size-5xl: 3rem;       /* 48px */
--font-size-6xl: 3.75rem;    /* 60px */
--font-size-7xl: 4.5rem;     /* 72px */
```

### Font Weights
- Light: 300
- Normal: 400
- Medium: 500
- Semibold: 600
- Bold: 700
- Extrabold: 800

### Usage Examples
```tsx
// Using Tailwind classes
<h1 className="text-4xl font-bold">Heading</h1>
<p className="text-base font-normal">Body text</p>
<span className="text-sm font-medium">Small text</span>

// Using CSS variables
<h1 style={{ fontSize: 'var(--font-size-4xl)', fontWeight: 'var(--font-weight-bold)' }}>
  Heading
</h1>
```

## Color Palette

### Primary Colors
```css
--color-primary: #03C0B6        /* Main brand color */
--color-primary-light: #1DD4CA  /* Hover states */
--color-primary-dark: #02A89F   /* Active states */
```

**Shades**: 50, 100, 200, 300, 400, 500, 600, 700, 800, 900

### Secondary Colors
```css
--color-secondary: #6366F1      /* Indigo */
```

### Accent Colors
```css
--color-accent: #F59E0B         /* Amber */
```

### Semantic Colors
- **Success**: #10B981 (Green)
- **Warning**: #F59E0B (Amber)
- **Error**: #EF4444 (Red)
- **Info**: #3B82F6 (Blue)

### Neutral Colors
Gray scale from 50 (lightest) to 900 (darkest)

### Background Colors
```css
--color-background: #FFFFFF
--color-background-secondary: #F9FAFB
--color-background-muted: #E5E7EB
```

### Text Colors
```css
--color-text-primary: #111827
--color-text-secondary: #6B7280
--color-text-tertiary: #9CA3AF
--color-text-link: #03C0B6
```

### Usage Examples
```tsx
// Using Tailwind classes
<div className="bg-primary text-white">Primary button</div>
<div className="bg-gray-100 text-gray-900">Card</div>
<span className="text-primary">Link</span>

// Using CSS variables
<div style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-text-inverse)' }}>
  Primary button
</div>
```

## Spacing Scale

Based on 4px base unit:
```css
--spacing-1: 0.25rem;   /* 4px */
--spacing-2: 0.5rem;    /* 8px */
--spacing-3: 0.75rem;   /* 12px */
--spacing-4: 1rem;      /* 16px */
--spacing-5: 1.25rem;   /* 20px */
--spacing-6: 1.5rem;    /* 24px */
--spacing-8: 2rem;      /* 32px */
--spacing-10: 2.5rem;   /* 40px */
--spacing-12: 3rem;     /* 48px */
--spacing-16: 4rem;     /* 64px */
--spacing-20: 5rem;     /* 80px */
--spacing-24: 6rem;     /* 96px */
```

### Usage Examples
```tsx
<div className="p-4 m-6">Content</div>
<div className="space-y-4">Stacked items</div>
<div className="gap-6">Grid items</div>
```

## Border Radius

```css
--radius-sm: 0.25rem;    /* 4px */
--radius-base: 0.375rem; /* 6px */
--radius-md: 0.5rem;     /* 8px */
--radius-lg: 0.75rem;    /* 12px */
--radius-xl: 1rem;       /* 16px */
--radius-2xl: 1.5rem;    /* 24px */
--radius-3xl: 2rem;      /* 32px */
--radius-full: 9999px;   /* Fully rounded */
```

### Usage Examples
```tsx
<button className="rounded-lg">Button</button>
<div className="rounded-xl">Card</div>
<img className="rounded-full" />
```

## Shadows

```css
--shadow-xs: Subtle shadow
--shadow-sm: Small shadow
--shadow-base: Default shadow
--shadow-md: Medium shadow
--shadow-lg: Large shadow
--shadow-xl: Extra large shadow
--shadow-2xl: 2X large shadow
```

### Usage Examples
```tsx
<div className="shadow-md">Card</div>
<div className="shadow-lg hover:shadow-xl">Elevated card</div>
```

## Transitions

```css
--transition-fast: 150ms
--transition-base: 200ms
--transition-slow: 300ms
--transition-slower: 500ms
```

### Usage Examples
```tsx
<button className="transition-all duration-base hover:scale-105">
  Hover me
</button>
```

## Component Patterns

### Buttons
```tsx
// Primary button
<button className="bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-light transition-all">
  Primary Button
</button>

// Secondary button
<button className="bg-gray-100 text-gray-900 px-6 py-3 rounded-lg font-medium hover:bg-gray-200 transition-all">
  Secondary Button
</button>
```

### Cards
```tsx
<div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-all">
  <h3 className="text-xl font-semibold mb-2">Card Title</h3>
  <p className="text-gray-600">Card content</p>
</div>
```

### Inputs
```tsx
<input
  type="text"
  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
  placeholder="Enter text"
/>
```

## Accessibility

### Focus States
All interactive elements have visible focus states:
```css
.focus-ring {
  outline: 2px solid var(--color-border-focus);
  outline-offset: 2px;
}
```

### Color Contrast
All color combinations meet WCAG AA standards for contrast ratios.

### Font Rendering
- Anti-aliasing enabled for smooth text rendering
- Optimized for legibility across all screen sizes

## Responsive Design

### Breakpoints
```css
--breakpoint-sm: 640px
--breakpoint-md: 768px
--breakpoint-lg: 1024px
--breakpoint-xl: 1280px
--breakpoint-2xl: 1536px
```

### Usage
```tsx
<div className="text-base md:text-lg lg:text-xl">
  Responsive text
</div>
```

## Migration Guide

### From Old System
The design system maintains backward compatibility:

```tsx
// Old (still works)
<div className="bg-themeColor">Content</div>

// New (recommended)
<div className="bg-primary">Content</div>
```

### CSS Variables
```css
/* Old */
color: var(--themeColor);

/* New */
color: var(--color-primary);
```

## Best Practices

1. **Use Tailwind classes** for most styling needs
2. **Use CSS variables** for dynamic or computed values
3. **Maintain consistency** by using design tokens
4. **Test accessibility** with keyboard navigation and screen readers
5. **Optimize performance** by avoiding inline styles when possible
6. **Follow naming conventions** for custom classes

## Resources

- [Inter Font](https://fonts.google.com/specimen/Inter)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [CSS Variables Guide](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties)

## Support

For questions or issues with the design system, refer to:
- `src/styles/design-tokens.css` - All design tokens
- `src/styles/globals.css` - Global styles
- `tailwind.config.js` - Tailwind configuration
