# OhDoKing Builder Blueprint

## Overview

This document outlines the plan for developing the OhDoKing Builder application. It will be updated as new features are added.

## Current State

The project is a simple HTML, CSS, and JavaScript application.

## Dark Mode and Light Mode Implementation Plan

1.  **Understand Existing Code:** Review `index.html`, `style.css`, and `main.js` to understand the current structure and styling.
2.  **Update `blueprint.md`:** Create this document to track the project's development.
3.  **Add Theme Switcher to HTML:** Add a button to `index.html` to toggle between light and dark modes.
4.  **Update CSS with Theme Variables:**
    *   Define CSS variables for light and dark themes.
    *   Apply these variables to the existing styles.
    *   Use a class or data attribute on the `body` element to switch between themes.
5.  **Implement Theme Switching in JavaScript:**
    *   Add a click event listener to the theme switcher button in `main.js`.
    *   Toggle the theme class/attribute on the `body` element.
    *   Use `localStorage` to save the user's theme preference.
6.  **Commit and Push:**
    *   Stage the changes using `git add`.
    *   Commit the changes with a descriptive message.
    *   Push the changes to the remote repository.