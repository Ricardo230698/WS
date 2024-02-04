// Importing the database connection
const mongodb = require('../connectionDB/mongodb');
const ObjectId = require('mongodb').ObjectId;

const getAllTeams = async (req, res, next) => {
    const result = await mongodb.getDb().db('Sports').collection('teams').find();
    result.toArray().then(lists => {
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(lists);
    })
}

const getTeamById = async (req, res, next) => {
    const teamId = new ObjectId(req.params.id);

    const result = await mongodb.getDb().db('Sports').collection('teams').findOne( { _id: teamId } );
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(result);
}

const createNewTeam = async (req, res, next) => {
    const result = await mongodb.getDb().db('Sports').collection('teams').insertOne( req.body );

    res.setHeader('Content-Type', 'application/json');
    res.status(201).json(result);
}

const updateTeam = async (req, res, next) => {
    const teamId = new ObjectId(req.params.id);

    const updatedTeam = {
        name : req.body.name,
        foundationDate : req.body.foundationDate,
        website : req.body.website,
        nationalCups : req.body.nationalCups,
        internationalCups : req.body.internationalCups,
        stadiumName : req.body.stadiumName,
        city : req.body.city
    }

    const result = await mongodb.getDb().db('Sports').collection('teams').updateOne( { _id: teamId }, { $set: updatedTeam } );

    console.log(result);
    res.status(204).send();
}

const deleteTeam = async (req, res, next) => {
    const teamId = new ObjectId(req.params.id);

    const result = await mongodb.getDb().db('Sports').collection('teams').deleteOne({ _id: teamId });

    res.status(200).send();
}

module.exports = {
    getAllTeams,
    getTeamById,
    createNewTeam,
    updateTeam,
    deleteTeam
}
