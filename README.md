# My Application - Well Said | Affirmations for Motivation & Relaxation

My application/site was inspired by my meditation practice in which I've learned more about the naturally unruly nature of our wandering brains and our subconscious acceptance of unfiltered personal narrative. Practicing affirmations, then, is to our brain as physical exercise is to our body. It is a practice in which we are creating and strengthening mental pathways and thought patterns to which we've given our intention.

This app would serve as a library of these affirmations that individual users can gather, group, and change as needed. These are fed into a practice page that offers an intervallic display of their affirmation statements that can be filtered down by collection.

[Read the project planning document here.](https://docs.google.com/document/d/1EVRrR_O1Z2PkNY7J9A5jII5L8Tn0egRS7W03xi8cQCQ/edit?usp=sharing) Wireframe, dataflow, and database design available through doc.

## Basic Features
 * Agile approach to workflow: Kanban method used to track app progress through Trello board
 * App remotely stored on GitHub and deployed through Heroku via GitHub
 * NodeJS environment
 * Back end created with Express.js web app framework
 * Use of promise-base ORM Sequelize in support of the dialect PostgreSQL for server-side setup
    You can access the [server repository here.](https://github.com/jgpowellcreates/affirm-server)
 * Implemented multiple levels of Database Associations with different relationships - one-to-one, one-to-many
 * 22 functional endpoints to my own created API (17 in site use, 5 for testing purposes)
     * Full CRUD operations for at least 2 data models using RESTful API
     * User registration & authentication - utilized [JSON Web Token](https://jwt.io/) and bcrypt.js
     * Role-based access to Admin Dash and site-editing features (role can only be changed in DB currently)
 * Project's Front end written with TypeScript. Minimal use of "any" type (< 3 in v0.1.0 deployment)
 * Developed with React Legacy - utilizing the previous Lifecycle methods, stateful variable implementation and class components that are likely serving as existing frameworks for many groups.
     * Used React Routing and Guarded routes
 * Basic form validation written in with RegEx requirements, without use of external library.
 * Front end styled with TailWindCss, HeadlessUI and styled-components for TailWind(consequently running with Craco scripts)
 * Project deployed on Heroku

## Features to Add
Immediate Goals:
 * Restructured pages that allow for list/collection overflow scrolling
 * Form validation to extend error catching/limitation communication to DOM
 * Drag & drop list reordering for Admin

Next Steps:


If you're interested in this project and have any questions or would like to extend its use, please reach out to me!
