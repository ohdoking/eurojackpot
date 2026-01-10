# OhDoKing Builder Blueprint

## Overview

This document outlines the plan for developing the OhDoKing Builder application. It has been restructured into a two-step application flow: a generation page and a result page, with a loading screen in between. The UI/UX has been further refined for a more engaging and user-friendly experience. Google AdSense has also been integrated.

## Application Flow

1.  **Generation Page (`index.html`):** The user is presented with a prominent "Generate" button and a "How it works" section for guidance.
2.  **Loading Screen (`loading.html`):** Upon clicking the button, the user is redirected to a loading screen with a canvas-based "treasure chest" animation.
3.  **Result Page (`result.html`):** After the loading screen, the user is automatically redirected to the result page, where the generated numbers are displayed. The result page also includes the comments section. The generated numbers are passed from the generation page to the loading screen and then to the result page via URL parameters.

## Code-level Refactors
*   **Number Generation:** The number generation logic is a standalone function in `main.js`.
*   **Canvas Animation:** The loading screen animation is handled by `treasure.js`.

## Features

### UI/UX

*   **Modern Design:** The UI has a modern aesthetic, with a consistent design across all pages.
*   **Improved Guidance:** The `index.html` page now includes a "How it works" section to guide the user.
*   **Visual Hierarchy:**
    *   The lottery numbers on the result page are larger and more prominent.
    *   The "Generate" button on `index.html` is larger to emphasize the primary action.
    *   The "Back to Generator" button on `result.html` is styled as a secondary action.
*   **Micro-interactions:**
    *   The lottery card has a subtle "lift" effect on hover.
*   **Two-Column Layout:** The result page features a two-column layout.
*   **Typography:** The 'Poppins' font is used for a clean and elegant look.
*   **Icons:** Font Awesome icons are used to enhance the visual appeal.
*   **Favicon:** The site has a custom favicon.
*   **Animations:**
    *   The loading screen features a canvas animation of a treasure chest.
    *   The lottery numbers have a "flip" animation on the result page.
*   **Color Palette:** A vibrant and modern color palette is used, with support for both light and dark modes.
*   **Layout:** The layout is spacious and balanced.
*   **Card Design:** The lottery card has a "lifted" design with a subtle gradient and a pronounced box-shadow.
*   **Interactive Buttons:** Buttons have hover effects.
*   **Gradient Background:** A modern gradient background is used.
*   **Footer:** A footer with copyright information is included.

### Internationalization (i18n)

*   **Language Switcher:** A language switcher is available in the header.
*   **Automatic Language Detection:** The default language is automatically detected.
*   **Supported Languages:** English, German, and Spanish are supported.
*   **Persistence:** The user's language preference is saved in `localStorage`.

### Dark Mode and Light Mode

*   **Theme Switcher:** A theme switcher button is located at the top-right of the page.
*   **CSS Variables:** The application uses CSS variables for easy theming.
*   **Persistence:** The user's theme preference is saved in `localStorage`.

### Google AdSense Integration

*   Google AdSense meta tag and script have been added to all HTML pages (`index.html`, `loading.html`, `result.html`) for verification and ad serving.
*   **Note:** To display actual ads, you would need to manually place `<ins class="adsbygoogle" ...></ins>` tags where you want the ads to appear on your pages.

### Disqus Integration

*   **Comments Section:** A Disqus comments section is included on the result page.
*   **Configuration:** The Disqus script is configured to use the page's URL as the identifier.