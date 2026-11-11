const router = require('express').Router();
const db = require('../../db/conexion') 
const { verificarContra , crearToken} = require("./funciones")


router.get("/", (req,res,next) => {
    res.send("OK GET login")
})

router.post('/', function(req, res, next){
    const {email, contrasena} = req.body;
    

    const sql = "SELECT id_usuario, nombre, email, rol ,contrasena FROM usuarios WHERE email = ?";

    db.query(sql, [email])
    .then(([usuarios]) => {
        if (usuarios.length === 1 ) {
            //existe el usuario
        const usuario = usuarios[0];
        if (verificarContra(contrasena, usuario.contrasena)){
            //generar token
            const token = crearToken(usuario)
            res.status(200).json({token})
        } else{
            res.status(403).send("No coincide usuario/contraseña")
        }
        } else {
            //no existe 
            
            res.status(401).send("No existe el usuario");
        }
    })
    .catch ((error) => {
        console.error(error);
        res.status(500).send("Ocurrio Error")
    })
})
    module.exports = router