require('dotenv').config();
const express = require('express');
const apiRouter = require("./api/main")

const {PORT} = process.env; 

const app = express();

app.use(express.json());


app.use("/api", apiRouter)

app.get('/', function(req,res,next){
    console.log("Ingreso a /");
    res.send("primer proyecto")

})

app.listen(PORT, function(error){
    if (error) {
        console.error(error)
        procces.exit(1);
    }
    
    console.log(`Servidor escuchando en puerto ${PORT} `);

})