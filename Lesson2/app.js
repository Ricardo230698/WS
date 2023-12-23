const express = require('express');
const bodyParser = require('body-parser');
// Body-parser es una librería de Node. js que se utiliza con Express para analizar y procesar los datos de solicitudes HTTP, como JSON o datos de formulario. Permite acceder a los datos del cuerpo de la solicitud en un formato fácilmente utilizable en una aplicación Node.js.
const professionalRoutes = require('./routes/routes');
const port = process.env.PORT || 8080;
const app = express();

// Importing the database connection
const mongodb = require('./DBconnection/mongodb');

// Middlewares
app.use(bodyParser.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*'); // A response that tells the browser to allow code from any origin to access a resource
    next();
})

app.use('/professional', professionalRoutes);

// Here I'm using the function we created and exported from our connection database file.
// So far the only difference is that I'm using app.listen inside of this function.
mongodb.initDb((err, mongodb ) => {
    if (err) {
      console.log(err);
    } else {
      app.listen(port);
      console.log('Running');
    }
});