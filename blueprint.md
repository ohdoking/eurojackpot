# Blueprint for Eurojackpot Pro - AI Statistics Numbers

## Overview
This blueprint outlines the development and enhancement of the "Eurojackpot Pro - AI Statistics Numbers" website. The primary goal is to create a visually appealing, functional, and trustworthy platform that provides AI-powered statistical insights for Eurojackpot numbers. This document will detail the current state, planned features, and structural improvements.

## Current State and Implemented Features

### Initial Structure
The project is a framework-less web application utilizing HTML, CSS, and JavaScript.
- **`index.html`**: Main entry point.
- **`style.css`**: Global styles.
- **`main.js`**: Core JavaScript logic, including number generation, theme switching, and internationalization.
- **`public/data/eurojackpot_context_dataset.json`**: JSON data for historical draws.

### Key Features
- **Lottery Number Generation**: Generates random and statistical Eurojackpot numbers.
- **Theme Switching**: Toggles between light and dark modes.
- **Internationalization (i18n)**: Supports English, German, Spanish, and French.
- **Custom Web Components**: Uses `<lottery-numbers>` for displaying generated numbers.
- **Error Handling**: Basic error handling for fetching draw data.

### Implemented Fixes
- **`main.js` Error Fix**: Resolved `TypeError: Cannot read properties of undefined (reading 'length')` by correcting the return value of `fetchDrawData` from `data.draws` to `data`, as the JSON file directly returns an array.

## Plan for Current Request: Update Website UI Schema for Trustworthiness and Informativeness

### Objective
Enhance the website's trustworthiness and informativeness by implementing structured data (JSON-LD) and improving meta tags.

### Identified Areas for Improvement
1.  **Missing `meta name="description"` tag**: Essential for SEO and clear search engine summaries.
2.  **Lack of JSON-LD Structured Data**: Crucial for search engine understanding and rich snippet display.

### Proposed Specific Additions/Modifications
1.  **Add `meta name="description"` to `index.html`**:
    *   Content: "Eurojackpot Pro provides AI-powered statistical analysis for Eurojackpot lottery numbers. Get data-driven insights and generate your lucky numbers for a more informed play."
2.  **Add `WebSite` JSON-LD to `index.html`**:
    ```json
    {
      "@context": "http://schema.org",
      "@type": "WebSite",
      "name": "Eurojackpot Pro - AI Statistics Numbers",
      "url": "https://www.example.com", // Placeholder: Replace with actual site URL
      "potentialAction": {
        "@type": "SearchAction",
        "target": "https://www.example.com/search?q={search_term_string}", // Placeholder: Replace with actual search URL
        "query-input": "required name=search_term_string"
      }
    }
    ```
3.  **Add `Organization` JSON-LD to `index.html`**:
    ```json
    {
      "@context": "http://schema.org",
      "@type": "Organization",
      "name": "Eurojackpot Pro - AI Statistics Numbers",
      "url": "https://www.example.com", // Placeholder: Replace with actual site URL
      "logo": "https://www.example.com/logo.png", // Placeholder: Replace with actual logo URL
      "sameAs": [
        "https://www.facebook.com/eurojackpotpro", // Placeholder: Replace with actual social media URLs
        "https://twitter.com/eurojackpotpro"
      ]
    }
    ```
    *(Note: `url` and `logo` will be placeholders. The user would need to provide actual URLs for their site and logo.)*

### Steps for Implementation
- **Step 1**: Add the `meta name="description"` tag within the `<head>` section of `index.html`. (Completed)
- **Step 2**: Insert the `WebSite` JSON-LD script within the `<head>` section of `index.html`. (Completed)
- **Step 3**: Insert the `Organization` JSON-LD script within the `<head>` section of `index.html`. (Completed)

### Verification
- After implementing, manually inspect `index.html` to ensure correct placement and syntax of the new meta tags and JSON-LD scripts. (Completed)
- *(Future step, not part of this blueprint)*: Use Google's Rich Results Test tool to validate the structured data.

## Latest Changes

- **Added translations for `generateStatisticalButton`**:
  - `en`: "Generate AI Statistical Numbers"
  - `de`: "KI-Statistische Zahlen generieren"
  - `es`: "Generar Números Estadísticos de IA"
  - `fr`: "Générer des Nombres Statistiques IA"
- **Moved translations to `public/data/translations.json`**:
  - The `translations` object has been extracted from `main.js` and moved to `public/data/translations.json`.
  - The `fetchData` function in `main.js` has been updated to fetch `translations.json` alongside `eurojackpot_context_dataset.json`.
  - The `DOMContentLoaded` listener and `setLanguage` function in `main.js` have been updated to utilize the fetched translations.
- **Updated `loading.html` to match `index.html` structure**:
  - The `<head>` section of `loading.html` has been updated to include meta description, JSON-LD for WebSite and Organization, favicon, and Font Awesome stylesheet, while preserving the loading-specific styles.
  - The `<body>` section of `loading.html` has been updated to include the `page-wrapper`, theme switcher, and main content area, while retaining the loading-specific elements and omitting the header and footer. `main.js` and `treasure.js` are now correctly included.
- **Fixed `main.js` destructuring and `DOMContentLoaded` listener**:
  - The commented-out `translations` object was removed from `main.js`.
  - The destructuring assignment `const [allDraws, translations ]= await fetchData();` was corrected to `const { allDraws: fetchedDraws, translations: fetchedTranslations } = await fetchData();`.
  - The `DOMContentLoaded` listener was updated to correctly assign `fetchedDraws` and `fetchedTranslations` to the global `allDraws` and `translations` variables, and to correctly log the number of translations loaded using `Object.keys(translations).length`.
- **Fixed `statisticalGeneratorBtn` functionality**:
  - The event listener blocks for `generatorBtn` and `statisticalGeneratorBtn` have been moved inside the `DOMContentLoaded` listener to ensure `allDraws` and `translations` are loaded before the buttons' functionality is enabled.
- **Fixed `TypeError: Cannot read properties of undefined (reading 'title')` in `setLanguage` function**:
  - Added checks within the `setLanguage` function to ensure `translations[lang]` and `translations[lang][key]` exist before attempting to access them, providing a fallback to English or displaying the key if a translation is missing.
- **Fixed `TypeError: Cannot read properties of undefined (reading 'toLowerCase')` in `generateStatisticalNumbers` function**:
  - Added a more robust check for `draw.weather.condition` to ensure it exists before calling `toLowerCase()` on it.