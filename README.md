# Performance Metrics

This project is used to analyze the employees performace over the period.

## About

Purpose of this project:
- To showcase the following details on the top
    - Avg Performance Score
    - Goals Completed
    - Team Morale Index
    - Top Performer
- Charts
    - Monthly Performance Trend (Line Chart)
    - Department Avg Score (Vertical Bar)
    - Q2 Goal Progress (Doughnut chart)
- Employee Directory
    - It consists all employees information
        - Total number of employees
        - Total number of departments to with employees are associated
        - Table with employees details
        - Pagination at the bottom
- Top Employee in Each Department (Horizontal Bar Graph)
- Employee Information
    - When user clicks on any of the horizontal bar graph, then respective employee details would be visible in this section

---


## Tech stack

- Angular (version 21.2.0)
- TypeScript (version 5.9.2)
- RxJS (version 7.8.0)
- SCSS
- Using mock data throguh JSON server


## Getting Started

### Prerequisites

Make sure you have installed:

- Node.js (>= 22.X.X)
- npm (>= 10.X.X)
- Angular CLI (>= 21.X.X)

To install Angular CLI
```bash
npm install -g @angular/cli
```

To install project dependencies
```bash
npm install
```


## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. Bydefault it'll create in src/app location. 
To generate a new component, run:

```bash
ng generate component component-name - To generate a component
ng generate service service-name - To generate a service
```


For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

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

## To run mock API server

```bash
npx json-server --watch mock-api/db.json
```

## Project Structure

- src
    - app
        - core
            - interceptors
            - services
        - features
        - layouts
        - shared
            - components
            - models
            - pipes
        - app.html
        - app.ts
        - app.routes.ts
    - styles
    - environments
    - index.html
    - main.ts