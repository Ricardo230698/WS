// Importing the database connection
const mongodb = require('../ConnectionDB/mongodb');
const ObjectId = require('mongodb').ObjectId;

const getAllData = async (req, res) => {
    const result = await mongodb.getDb().db('users').collection('contacts').find();
    result.toArray().then(
        (err) => {
            if (err) {
                res.status(400).json({ message: err })
            }
        },
        (lists) => {
            res.setHeader('Content-Type', 'application/json');
            res.status(200).json(lists);
        }
    )
}

const getDataById = async (req, res) => {
    // let color = req.params.color;
    const contactId = new ObjectId(req.params.id);
    
    if(!ObjectId.isValid(contactId)) {
        res.status(400).json('You should try with a valid contact ID');
    }

    const result = await mongodb.getDb().db('users').collection('contacts').find( { _id: contactId } );
    result.toArray().then(
        (err) => {
            if (err) {
                res.status(400).json({ message: err })
            }    
        },
        (item) => {
            res.setHeader('Content-Type', 'application/json');
            res.status(200).json(item[0]);
        }
    )
}

const createNewContact = async (req, res) => {
    // const contact = {
    //     firstName : req.body.firstName,
    //     lastName : req.body.lastName,
    //     email : req.body.email,
    //     favoriteColor : req.body.favoriteColor,
    //     birthday : req.body.birthday
    // }

    const result = await mongodb.getDb().db('users').collection('contacts').insertOne( req.body );

    if (result.acknowledged) {
        res.status(201).json(result);
    } else {
        res.status(500).json(result.error || 'An error ocurred while creating the contact');
    }
}

const updateContact = async (req, res, next) => {
    const contactId = new ObjectId(req.params.id);

    if(!ObjectId.isValid(contactId)) {
        res.status(400).json('You should try with a valid contact ID');
    }

    const updatedContact = {
        firstName : req.body.firstName,
        lastName : req.body.lastName,
        email : req.body.email,
        favoriteColor : req.body.favoriteColor,
        birthday : req.body.birthday
    }
    
    const result = await mongodb.getDb().db('users').collection('contacts').updateOne({ _id: contactId }, { $set: updatedContact });

    console.log(result);

    if (result.modifiedCount > 0) {
        res.status(204).send();
    } else {
        res.status(500).json(result.error || 'An error ocurred while updating the contact');
    }
}

const deleteContact = async (req, res, next) => {
    const contactId = new ObjectId(req.params.id);

    if(!ObjectId.isValid(contactId)) {
        res.status(400).json('You should try with a valid contact ID');
    }

    const result = await mongodb.getDb().db('users').collection('contacts').deleteOne({ _id: contactId });

    console.log(result);
    
    if (result.deletedCount > 0) {
        res.status(204).send();
    } else {
        res.status(500).json(result.error || 'An error ocurred while deleting the contact');
    }
}

module.exports = {
    getAllData,
    getDataById,
    createNewContact,
    updateContact,
    deleteContact
}