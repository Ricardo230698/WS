const routes = require('express').Router();
const temples = require('../controllers/temple.js');

routes.get('/', temples.findAll);
routes.get('/:temple_id', temples.findOne);

routes.post('/', temples.create);

// Now that you have documented the routes that are existing, talk with your team about what routes are missing. Add these routes to the API documentation.
routes.put('/:id', temples.update);
routes.delete('/:id', temples.delete);
routes.delete('/', temples.deleteAll);

module.exports = routes;

