const express = require('express');
const bodyParser = require('body-parser');
const router = require('./routers/index');
const port = process.env.PORT || 8080;
const app = express();
const createError = require('http-errors');

// Swagger
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

// Importing the database connection
const mongodb = require('./connectionDB/mongodb');

// Middlewares
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(bodyParser.json());
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    next();
})
app.use('/', router);

process.on('uncaughtException', (err, origin) => {
    console.log(process.stderr.fd, `Caught exception: ${err}\n` + `Exception origin: ${origin}`);
})

app.use((req, res, next) => {
    // const err = new Error('Not found');
    // err.status = 404;
    // next(err);
    next(createError(404, "Not found"));
})

app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.send({
        error: {
            status: err.status || 500,
            message: err.message
        }
    })
})

// Here I'm using the function we created and exported from our connection database file.
// So far the only difference is that I'm using app.listen inside of this function.
mongodb.initDb((err, mongodb) => {
    if (err) {
        console.log(err);
    } else {
        app.listen(port);
        console.log('Running');
    }
})