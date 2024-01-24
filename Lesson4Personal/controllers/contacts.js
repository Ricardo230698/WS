// Importing the database connection
const mongodb = require('../ConnectionDB/mongodb');
const ObjectId = require('mongodb').ObjectId;

const getAllData = async (req, res, next) => {
    const result = await mongodb.getDb().db('users').collection('contacts').find();
    result.toArray().then(lists => {
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(lists);
    })    
}

const getDataById = async (req, res, next) => {
    // let color = req.params.color;
    const contactId = new ObjectId(req.params.id);
    
    const result = await mongodb.getDb().db('users').collection('contacts').findOne( { _id: contactId } );
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(result);
}

const createNewContact = async (req, res, next) => {
    // const contact = {
    //     firstName : req.body.firstName,
    //     lastName : req.body.lastName,
    //     email : req.body.email,
    //     favoriteColor : req.body.favoriteColor,
    //     birthday : req.body.birthday
    // }

    const result = await mongodb.getDb().db('users').collection('contacts').insertOne( req.body );

    res.setHeader('Content-Type', 'application/json');
    res.status(201).json(result);
}

const updateContact = async (req, res, next) => {
    const contactId = new ObjectId(req.params.id);

    const updatedContact = {
        firstName : req.body.firstName,
        lastName : req.body.lastName,
        email : req.body.email,
        favoriteColor : req.body.favoriteColor,
        birthday : req.body.birthday
    }
    
    const result = await mongodb.getDb().db('users').collection('contacts').updateOne({ _id: contactId }, { $set: updatedContact });

    console.log(result);
    // res.setHeader('Content-Type', 'application/json');
    res.status(204).send();
}

const deleteContact = async (req, res, next) => {
    const contactId = new ObjectId(req.params.id);

    const result = await mongodb.getDb().db('users').collection('contacts').deleteOne({ _id: contactId });

    console.log(result);
    res.status(200).send();
}

module.exports = {
    getAllData,
    getDataById,
    createNewContact,
    updateContact,
    deleteContact
}