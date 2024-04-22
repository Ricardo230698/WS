const express = require('express');
const router = express.Router();

const teamsController = require('../controllers/teams');
const validation = require('../middleware/validate');

router.get('/', teamsController.getAllTeams);

router.get('/:id', teamsController.getTeamById);

router.post('/', validation.saveTeam, teamsController.createNewTeam);

router.put('/:id', validation.saveTeam, teamsController.updateTeam);

router.delete('/:id', teamsController.deleteTeam);

module.exports = router;