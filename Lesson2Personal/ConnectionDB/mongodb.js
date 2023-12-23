// This file is the connection to the database and has some functions that allow us to interact with the database itself
// Those functions are initDb and getDb
// This file is super handy because can be used for many projects

//These next two lines help us protect sensible data
const dotenv = require('dotenv');
dotenv.config();

// This line helps us connect to our database (together with line 20 of this file)
const mongoClient = require('mongodb').MongoClient;

let _db;

// This function is where we initialize our database, we are calling this function in the app.js file
const initDb = callback => {
    if (_db) {
        console.log('Db is already initialized');
        return callback(null, _db);
    }
    mongoClient.connect(process.env.MONGODB_URI) // Here we connect to our database
        .then(client => {
            _db = client;
            callback(null, _db);
        })
        .catch(err => {
            callback(err);
        })
}

// This function is where we perform the main interactions with the database itself. For instance, we are calling...
// ... this function in professional.js (our controller) to GET the data that we need for this specific project
const getDb = () => {
    if (!_db) {
        throw Error('Db not initialized');
    }
    return _db;
}

// We are exporting those handy functions for us to use them
module.exports = {
    initDb,
    getDb
}