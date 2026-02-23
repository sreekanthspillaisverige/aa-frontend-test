# Brewery Finder
This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 21.1.4.

This app allows users to search breweries using the Open Brewery DB public API, view suggestions, view a detailed view of suggestions, and keep the search history.

This project focus on clean folder & component structure, modern Angular patterns like signals, responsive styling and strong test coverage.

# Overview
This is a single page, single-route application where the main screen is the search experience.

# Main features

Search breweries using public REST API.
Suggestions dropdown box while searching with partial results and possible to expand results.
Detail view on selection of suggestion.
Persistent search history using localstorage.
Fully responsive layout
Strong unit test coverage

# Tech Stack

Angular 21 (With Signals + Reactive forms)
SCSS
rxjs
Vitest for unit testing
Open brewery DB API

# Prerequisites

Node.js
npm

# Environment configuration
API base url is configured thorugh angular environment files.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Vitest](https://vitest.dev/) test runner, use the following command:

```bash
ng test
```
To execute unit tests with coverage with vitest

```bash
ng test --coverage
```

