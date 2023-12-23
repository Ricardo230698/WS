const express = require('express');
const router = express.Router();
// const mongodb = require('../ConnectionDB/mongodb');

const contactsController = require('../controllers/contacts');

// Create a GET request in your contacts route file that will return all of the documents in your contacts collection.
router.get('/', contactsController.getAllData);

// Create another GET request in your contacts route file that will return a single document from your contacts collection where an id matches the id from a query parameter.
router.get('/:color', contactsController.getDataById);

// router.get('/', (req, res, next) => {
//     if (!req.params) {
//         contactsController.getAllData;
//     } else {
//         contactsController.getDataById;
//     }
// });

module.exports = router;