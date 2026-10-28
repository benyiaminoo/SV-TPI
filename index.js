require('dotenv').config();
const express = require('express');

const {PORT} = process.env;

const app = express();

app.listen(PORT, function(error){
    if (error) {
        console.error(error)
        procces.exit(1);
    }
    
    console.log(`Servidor escuchando en puerto ${PORT} `);

})