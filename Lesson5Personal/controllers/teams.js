// Importing the database connection
const mongodb = require('../connectionDB/mongodb');
const ObjectId = require('mongodb').ObjectId;
const createError = require('http-errors');
// const { BSONError } = require('bson');

const getAllTeams = async (req, res, next) => {
    try {
        const result = await mongodb.getDb().db('Sports').collection('teams').find();
        result.toArray().then(
            (lists) => {
                res.setHeader('Content-Type', 'application/json');
                res.status(200).json(lists);
            }
        )
    } catch (error) {
        console.log(error.message);
        next(error);
    }
}

const getTeamById = async (req, res, next) => {
    const teamId = new ObjectId(req.params.id);

    // if(!ObjectId.isValid(teamId)) {
    //     res.status(400).json('You should try with a valid team ID');
    // }

    try {
        const result = await mongodb.getDb().db('Sports').collection('teams').findOne( { _id: teamId } );
        if(!result) {
            throw createError(404, 'ID does not exist. Try another one');
        }
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(result);
    } catch (error) {
        console.log(error.message);
        // if(BSONError.isBSONError(error)) {
        //     next(createError(400, 'Invalid ID'));
        //     // next(new BSONError(error.message));
        //     return;
        // }
        next(error);
    }

}

const createNewTeam = async (req, res, next) => {

    try {
        const result = await mongodb.getDb().db('Sports').collection('teams').insertOne( req.body );        
        if (result.acknowledged) {
            res.status(201).json(result);
        }
    } catch (error) {
        console.log(error.message);
        if (error.name === 'ValidationError') {
            next(createError(422, error.message));
        }
        next(error);
    }


}

const updateTeam = async (req, res, next) => {
    const teamId = new ObjectId(req.params.id);

    // if(!ObjectId.isValid(teamId)) {
    //     res.status(400).json('You should try with a valid team ID');
    // }

    const updatedTeam = {
        name : req.body.name,
        foundationDate : req.body.foundationDate,
        website : req.body.website,
        nationalCups : req.body.nationalCups,
        internationalCups : req.body.internationalCups,
        stadiumName : req.body.stadiumName,
        city : req.body.city
    }

    try {
        const result = await mongodb.getDb().db('Sports').collection('teams').updateOne( { _id: teamId }, { $set: updatedTeam } );
        if (result.modifiedCount == 0) {
            throw createError(404, 'ID does not exist. Try another one');
        }
        console.log(result);
        res.status(204).send();
    } catch (error) {
        console.log(error.message);
        next(error);
    }
}

const deleteTeam = async (req, res, next) => {
    const teamId = new ObjectId(req.params.id);

    // if(!ObjectId.isValid(teamId)) {
    //     res.status(400).json('You should try with a valid team ID');
    // }

    try {
        const result = await mongodb.getDb().db('Sports').collection('teams').deleteOne({ _id: teamId });
        if(result.deletedCount == 0) {
            throw createError(404, 'ID does not exist. Try another one');
        }
        console.log(result);
        res.status(204).send();
    } catch (error) {
        console.log(error.message);
        next(error);
    }
}

module.exports = {
    getAllTeams,
    getTeamById,
    createNewTeam,
    updateTeam,
    deleteTeam
}
