# Reports API

Current Version: 0.0.1

##1. Summary

This project is intended for managing report requests and receiving reports, which are generated in the background. It is also intended to demonstrate my abilities with node, express, typescript APIs.

It is user protected, so each user will have access to their own requests and generated reports. Once a report is generated, an email should go out notifying the user their report is ready.

##2. Setup

Start by cloning the repo and installing package dependencies:

```
git clone git@github.com:marceloribeiro/reports-api.git
cd reports-api
npm install
```

###2.1 Starting the Web Server

You can start the web server by running:

```
npm run dev
```

And you should be able to get to the app running here:

[http://localhost:3001](http://localhost:3001)

And the API docs are found here:

[http://localhost:3001/api-docs](http://localhost:3001/api-docs)

###2.2 Starting the Background Jobs Server

You can start the background jobs server by running:

```
npm run workers # starts the queue for processing workers
npm run cron    # starts the cron for scheduled workers
```

###2.3 Running tests

You can run tests for the existing routes by:

```
npm run tests
```

## 3. Design Choices and Assumptions

I decided to create a simple API with some key aspects that I find important:

- Clear separation of the concepts between Routes and Controllers
- Using [Prisma](https://www.prisma.io/) as the ORM of choice
- User Authentication and user based report requests and reports (+ middleware to handle authenticated users)
- RESTful controllers with standard routes so developers for client apps can love it
- Added OpenAPI documentation which is easily accessible via /api-docs
- Used [bull](https://www.npmjs.com/package/bull) for queue management (background jobs)
- Test Driven Development covered with Jest

## 4. Upcoming Features

When I have more time I plan to add the following:

- Proper validation when handling incoming requests/data
- Proper pagination of results
- Might consider nesting elements (i.e. report requests coming back with their reports)
- Actual emails going out instead of a mocked worker to send notifications to users
- Admin users concept so admin users can manage other user accounts