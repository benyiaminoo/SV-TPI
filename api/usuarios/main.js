const router = require("express").Router()
const db = require('../../db/conexion')

const { hashPass } = require('../usuarios/funciones')

const middleware = require("../middleware")

router.get("/", (req, res, next) => {
    res.send("OK GET -> usuarios")
    console.log("entró a /usuarios")
})

//crear usuario
router.post("/", (req, res, next) => {
    const { nombre, apellido, dni, contrasena, email } = req.body
    const passHasheada = hashPass(contrasena);

    const sql = "INSERT INTO usuarios (nombre, apellido , dni, contrasena , email) VALUES (?, ?, ?, ?, ?)";

    db.query(sql, [nombre, apellido, dni, passHasheada, email])
        .then(() => {
            res.status(201).send("Usuario creado")
            console.log("Se creó un usuario")
        })
        .catch((error) => {
            console.error(error);
            res.status(500).send("Ocurrio un error")
        })

})

//borrar usuario
router.delete("/:id", middleware, (req, res, next) => {
    const { id } = req.params

    const sql = "UPDATE usuarios SET activo = 0 WHERE id_usuario = ?";

    db.query(sql, [id])
        .then(() => {
            res.status(201).send("Usuario Eliminado")
            console.log("Se eliminó un usuario")
        })
        .catch((error) => {
            console.error(error);
            res.status(500).send("Ocurrio un error")
        })

})


module.exports = router;