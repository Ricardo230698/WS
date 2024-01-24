const express = require('express');
const bodyParser = require('body-parser');
const router = require('./routers/index');
const port = process.env.PORT || 8080;
const app = express();

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

// Importing the database connection
const mongodb = require('./ConnectionDB/mongodb');

// Middlewares
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(bodyParser.json())
app.use('/', router);

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