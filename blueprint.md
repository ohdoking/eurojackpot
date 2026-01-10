# OhDoKing Builder Blueprint

## Overview

This document outlines the plan for developing the OhDoKing Builder application. It will be updated as new features are added.

## Current State

The project is a simple HTML, CSS, and JavaScript application with a modern and visually appealing UI. It features a two-column layout, animations, and interactive elements.

## Features

### UI/UX

*   **Modern Design:** The UI has been redesigned with a modern aesthetic, including a new color palette, typography, and layout.
*   **Two-Column Layout:** The main content is on the left, and the Disqus comments section is on the right.
*   **Typography:** The 'Poppins' font is used for a clean and elegant look.
*   **Icons:** Font Awesome icons are used to enhance the visual appeal of buttons and the header.
*   **Favicon:** The site has a custom favicon.
*   **Animations:**
    *   The stars in the header have a spinning animation.
    *   The lottery numbers have a "flip" animation when they are generated, with a stagger effect.
*   **Color Palette:** A vibrant and modern color palette is used, with support for both light and dark modes.
*   **Layout:** The layout is spacious and balanced, with a focus on readability and user experience.
*   **Card Design:** The lottery card has a "lifted" design with a subtle gradient and a pronounced box-shadow.
*   **Interactive Buttons:** Buttons have hover effects and a subtle "glow" to provide visual feedback.
*   **Gradient Background:** A modern gradient background is used to create a premium feel.
*   **Footer:** A footer with copyright information has been added.

### Dark Mode and Light Mode

*   **Theme Switcher:** A button in the header allows users to toggle between light and dark modes.
*   **CSS Variables:** The application uses CSS variables for easy theming.
*   **Persistence:** The user's theme preference is saved in `localStorage`.

### Disqus Integration

*   **Comments Section:** A Disqus comments section is included on the right side of the page.
*   **Configuration:** The Disqus script is included in `index.html` and can be configured with a site-specific shortname and page identifiers. To make it fully functional, you need to:
    1.  Create a Disqus account and register your site to get your own "shortname".
    2.  Replace `'eurojackpot'` in the line `s.src = 'https://eurojackpot.disqus.com/embed.js';` with your actual Disqus shortname.
    3.  Uncomment the `disqus_config` section and set the `this.page.url` and `this.page.identifier` variables to dynamically reflect the page's URL and a unique identifier for each page.
