const router = require("express").Router()
const db = require('../../db/conexion')

const { hashPass } = require('../usuarios/funciones')

const middleware = require("../middleware")
const permitirRoles = require("../permisos")

//obtener usuarios
router.get("/", (req, res, next) => {
    const sql = "SELECT * FROM usuarios WHERE activo = 1" 

    db.query(sql)
        .then(([rows]) => {
            res.status(200).json(rows)
            console.log("Se trajeron a los usuarios")
        })
        .catch((error) => {
            console.error(error);
            res.status(500).send("Ocurrio un error")
        })
})

//obtener usuario por id
router.get("/:id", (req, res, next) => {
    const { id } = req.params
    const sql = "SELECT * FROM usuarios WHERE id_usuario = ?"

    db.query(sql, [id])
        .then(([rows]) => {
            res.status(200).json(rows)
            console.log("Se trajo a un usuario")
        })
        .catch((error) => {
            console.error(error);
            res.status(500).send("Ocurrio un error")
        })
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
router.delete("/:id", middleware,permitirRoles("admin"), (req, res, next) => {
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

//actualizar usuario
router.put("/:id", middleware, (req, res, next) => {
    const { id } = req.params;
    const { nombre, apellido, dni, contrasena, email, activo } = req.body
    const passHasheada = hashPass(contrasena);

    const sql = "UPDATE usuarios SET nombre = ?, apellido = ?, dni = ?, contrasena = ?, email = ?, activo = ? WHERE id_usuario = ?"

    db.query(sql, [nombre, apellido, dni, passHasheada, email, activo, id])
        .then(() => {
            res.status(201).send("Usuario actualizado")
            console.log("Se actualizó un usuario")
        })
        .catch((error) => {
            console.error(error);
            res.status(500).send("Ocurrio un error")
        })
})


module.exports = router;