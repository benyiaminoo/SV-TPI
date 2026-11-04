const router = require("express").Router()
const db = require('../../db/conexion')

const middleware = require("../middleware")

//obtener organizaciones
router.get("/", (req, res, next) => {

    const sql = "SELECT * FROM organizaciones"

    db.query(sql)
        .then(([rows]) => {
            res.status(200).json(rows)
            console.log("Se trajeron a las organizaciones")
        })
        .catch((error) => {
            console.error(error);
            res.status(500).send("Ocurrio un error")
        })
})

//obtener organizacion por id
router.get("/:id", (req, res, next) => {
    const { id } = req.params
    const sql = "SELECT * FROM organizacion WHERE id_org = ?"

    db.query(sql, [id])
        .then(([rows]) => {
            res.status(200).json(rows)
            console.log("Se trajo a la organizacion")
        })
        .catch((error) => {
            console.error(error);
            res.status(500).send("Ocurrio un error")
        })
})


//crear org con autorizacion
router.post("/crear", middleware, (req, res, next) => {
    const { nombre, ubicacion, creacion } = req.body

    const sql = "INSERT INTO organizaciones (nombre, ubicacion , creacion) VALUES (?, ?, ?)";

    db.query(sql, [nombre, ubicacion, creacion])
        .then(() => {
            res.status(201).send("Organización creada")
            console.log("Se creó una organización")
        })
        .catch((error) => {
            console.error(error);
            res.status(500).send("Ocurrio un error")
        })
})


//eliminar organizacion
router.delete("/:id", middleware, (req, res, next) => {
    const { id } = req.params

    const sql = "UPDATE organizaciones SET activo = 0 WHERE id_org = ?";

    db.query(sql, [id])
        .then(() => {
            res.status(201).send("Organización Eliminada")
            console.log("Se eliminó una organizacion")
        })
        .catch((error) => {
            console.error(error);
            res.status(500).send("Ocurrio un error")
        })

})

//actualizar organizacion
router.put("/:id", middleware, (req, res, next) => {
    const { id } = req.params;
    const { nombre, ubicacion, creacion, portada, activo } = req.body

    const sql = "UPDATE organizaciones SET nombre = ?, ubicacion = ?, creacion = ?, portada = ?, activo = ? WHERE id_org = ?"

    db.query(sql, [nombre, ubicacion, creacion, portada, activo, id])
        .then(() => {
            res.status(201).send("Organización actualizada")
            console.log("Se actualizó una organizacion")
        })
        .catch((error) => {
            console.error(error);
            res.status(500).send("Ocurrio un error")
        })
})



module.exports = router;