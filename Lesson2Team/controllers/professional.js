const router = require("../routes/routes")

// Importing the database connection
const mongodb = require('../DBconnection/mongodb');

// exports.getData = (req, res, next) => {
//   res.status(200).json(data);
// }

// Here I'm interacting with the other function we created in he db connection file (getDb);
const getData = async (req, res, next) => {
  const result = await mongodb.getDb().db('users').collection('users_collection').find();
  result.toArray().then(lists => {
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(lists[0]);
  })
}

module.exports = { getData };