const express = require('express');
const router = express.Router();
// const mongodb = require('../ConnectionDB/mongodb');

const contactsController = require('../controllers/contacts');
const validation = require('../middleware/validate');

// Create a GET request in your contacts route file that will return all of the documents in your contacts collection.
router.get('/', contactsController.getAllData);

// Create another GET request in your contacts route file that will return a single document from your contacts collection where an id matches the id from a query parameter.
router.get('/:id', contactsController.getDataById);

// Create a POST route to create a new contact. All fields are required. Return the new contact id in the response body.
router.post('/', validation.saveContact, contactsController.createNewContact);

// Create a PUT route to update a contact. This route should allow for a url similar to this: api-url-path/contacts/id-to-modify.
router.put('/:id', validation.saveContact, contactsController.updateContact);

// Create a DELETE route to delete a contact. Return an http status code representing the successful completion of the request.
router.delete('/:id', contactsController.deleteContact);

// router.get('/', (req, res, next) => {
//     if (!req.params) {
//         contactsController.getAllData;
//     } else {
//         contactsController.getDataById;
//     }
// });

module.exports = router;