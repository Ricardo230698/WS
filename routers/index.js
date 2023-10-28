import express from "express";

const router = express.Router();

router.get('/ricardo', (req,res) => {
    res.send('Hi Ricardo and welcome to CS 341. Let\'s have some fun!');
})

router.get('/matias', (req,res) => {
    res.send('Hi Matias and welcome to CS 341. Let\'s have some fun!');
})

// module.exports = router;
export default router;