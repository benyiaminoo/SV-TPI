const router = require("express").Router()
const db = require('../../db/conexion')

const middleware = require("../middleware")

//obtener eventos
router.get("/", (req, res, next) => {

    const sql = "SELECT * FROM eventos"

    db.query(sql)
        .then(([rows]) => {
            res.status(200).json(rows)
            console.log("Se trajeron los eventos")
        })
        .catch((error) => {
            console.error(error);
            res.status(500).send("Ocurrio un error")
        })
})

//obtener eventos por id
router.get("/:id", (req, res, next) => {
    const { id } = req.params
    const sql = "SELECT * FROM eventos WHERE id_evento = ?"

    db.query(sql, [id])
        .then(([rows]) => {
            res.status(200).json(rows)
            console.log("Se trajo al evento")
        })
        .catch((error) => {
            console.error(error);
            res.status(500).send("Ocurrio un error")
        })
})

//obtener eventos por id de organizacion
router.get("/org/:id", (req, res, next) => {
    const { id } = req.params
    const sql = "SELECT * FROM eventos WHERE organizacion_id = ?"

    db.query(sql, [id])
        .then(([rows]) => {
            res.status(200).json(rows)
            console.log("Se trajeron los eventos")
        })
        .catch((error) => {
            console.error(error);
            res.status(500).send("Ocurrio un error")
        })
})



//crear eventos con autorizacion
router.post("/crear", middleware, (req, res, next) => {
    const { nombre, organizacion_id, inicio, capacidad } = req.body

    const sql = "INSERT INTO eventos (nombre, organizacion_id, inicio, capacidad) VALUES (?, ?, ?, ?)";

    db.query(sql, [nombre, organizacion_id, inicio, capacidad,])
        .then(() => {
            res.status(201).send("evento creado")
            console.log("Se creó un evento")
        })
        .catch((error) => {
            console.error(error);
            res.status(500).send("Ocurrio un error")
        })
})


//eliminar evento
router.delete("/:id", middleware, (req, res, next) => {
    const { id } = req.params

    const sql = "UPDATE eventos SET activo = 0 WHERE id_evento= ?";

    db.query(sql, [id])
        .then(() => {
            res.status(201).send("Evento Eliminado")
            console.log("Se eliminó un evento")
        })
        .catch((error) => {
            console.error(error);
            res.status(500).send("Ocurrio un error")
        })

})

//actualizar evento
router.put("/:id", middleware, (req, res, next) => {
    const { id } = req.params;
    const { nombre, organizacion_id, inicio, capacidad, activo } = req.body

    const sql = "UPDATE eventos SET nombre = ?, organizacion_id = ?, inicio = ?, capacidad = ?, activo = ? WHERE id_evento = ?"

    db.query(sql, [nombre, organizacion_id, inicio, capacidad, activo, id])
        .then(() => {
            res.status(201).send("evento actualizado")
            console.log("Se actualizó un evento")
        })
        .catch((error) => {
            console.error(error);
            res.status(500).send("Ocurrio un error")
        })
})



module.exports = router;