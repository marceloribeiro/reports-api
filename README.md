### Reports API

This project is intended for managing report requests and receiving reports, which are generated in the background.

It is user protected, so each user will have access to their own requests and generated reports. Once a report is generated, an email should go out notifying the user their report is ready.

### Setup

Start by cloning the repo and installing package dependencies:

```
git clone git@github.com:marceloribeiro/reports-api.git
cd reports-api
npm install
```

## Starting the Web Server

You can start the web server by running:

```
npm run dev
```

And you should be able to get to the app running here:

[http://localhost:3001](http://localhost:3001)

## Starting the Background Jobs Server

You can start the background jobs server by running:

```
npm run workers # starts the queue for processing workers
npm run cron    # starts the cron for scheduled workers
```

## Running tests

You can run tests for the existing routes by:

```
npm run tests
```