// Importing the database connection
const mongodb = require('../ConnectionDB/mongodb');

const getAllData = async (req, res, next) => {
    const result = await mongodb.getDb().db('users').collection('contacts').find();
    result.toArray().then(lists => {
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(lists);
    })    
}

const getDataById = async (req, res, next) => {
    let color = req.params.color;
    
    const result = await mongodb.getDb().db('users').collection('contacts').findOne( { favoriteColor: color } );
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(result);
}

module.exports = {
    getAllData,
    getDataById
}