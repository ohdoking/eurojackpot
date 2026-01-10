# OhDoKing Builder Blueprint

## Overview

This document outlines the plan for developing the OhDoKing Builder application. It will be updated as new features are added.

## Current State

The project is a simple HTML, CSS, and JavaScript application.

## Features

### Dark Mode and Light Mode

*   **Theme Switcher:** A button in the header allows users to toggle between light and dark modes.
*   **CSS Variables:** The application uses CSS variables for easy theming.
*   **Persistence:** The user's theme preference is saved in `localStorage`.

### Disqus Integration

*   **Comments Section:** A Disqus comments section is included at the bottom of the main content.
*   **Configuration:** The Disqus script is included in `index.html` and can be configured with a site-specific shortname and page identifiers. To make it fully functional, you need to:
    1.  Create a Disqus account and register your site to get your own "shortname".
    2.  Replace `'eurojackpot'` in the line `s.src = 'https://eurojackpot.disqus.com/embed.js';` with your actual Disqus shortname.
    3.  Uncomment the `disqus_config` section and set the `this.page.url` and `this.page.identifier` variables to dynamically reflect the page's URL and a unique identifier for each page.
