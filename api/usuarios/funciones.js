const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")
const {TOKEN_SECRET, SALT_ROUNDS} = process.env;

function hashPass(nuevaPass){
    const hash = bcrypt.hashSync(nuevaPass, parseInt(SALT_ROUNDS) );
    return hash; 
}

function verificarContra(nuevaContra, ContraHasheada){
    const coincide = bcrypt.compareSync(nuevaContra, ContraHasheada)
    return coincide;
}

function crearToken(datos) {
    const payload = { 
        nombre: datos.nombre,
        id: datos.id_usuario,
        // lo que necesiten
    }

    const token = jwt.sign(payload, TOKEN_SECRET, {expiresIn: "2h"});

    console.log("creó token")
    return token;
}
module.exports = { hashPass , verificarContra, crearToken}