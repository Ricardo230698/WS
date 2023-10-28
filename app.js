import express from "express";
import router from "./routers/index.js";

const app = express();
// const router = require('./routers/index');

app.use('/', router);

/*
app.get("/", (req, res) => {
    res.end("<h1>Hola Mundo</h1>");
})
*/

app.listen(3000, () => console.log("Iniciando Express desde http://localhost:3000"));