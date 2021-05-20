# Interview Scheduler

Interview Scheduler is a modern single page React client application that allows a user to book, manage and cancel interviews with a mentor.

Check out the 👉 [deployed website!](https://scheduler-rubyzhuang.netlify.app/) 👈

## Final Product

Creating an Interview
!["GIF Creating an Interview"]()

Editing an Interview
!["GIF of Editing an Interview"]()

Canceling an Interview
!["GIF of Canceling an Interview"]()

Error Messages for Saving and Deleting
!["GIF of Error Messages for Saving and Deleting"]()

## Features

- Interviews can be booked between Monday and Friday from 12PM - 5PM.
- The list of days informs the user how many slots are available for each day.
- A user can book an interview in an empty appointment slot by typing in their name and clicking on an interviewer from a list of available interviewers.
- A user can edit or cancel the details of an existing interview.
- The selected day updates the number of spots available when an interview is booked or canceled.
- A user is shown a status indicator while asynchronous operations are in progress.
- The application makes API requests to load and persist data.

## API Server

- Connected to the scheduler API server which persists data to a database
- 👉 Deployed Server
- Available at: https://github.com/Ruby-Zhuang/scheduler-api

## Tech Stack

- **Front-End**: React, Axios, Babel, SCSS
- **Testing**: Webpack Dev Server, Storybook, Jest, Cypress

## Setup

Install dependencies with `npm install`.

## Running Webpack Development Server

```sh
npm start
```

## Running Jest Test Framework

```sh
npm test
```

## Running Storybook Visual Testbed

```sh
npm run storybook
```
