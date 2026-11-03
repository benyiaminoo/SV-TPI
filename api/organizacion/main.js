const router = require("express").Router()
const db = require('../../db/conexion')

const middleware = require("../middleware")


router.get("/", (req,res,next) => {
    res.send("OK GET -> organizacion")
    console.log("Ingresó a /org")
})



//crear org con autorizacion
router.post("/crear", middleware, (req,res,next) => {
    const {nombre, ubicacion , creacion} = req.body
    
    const sql = "INSERT INTO organizaciones (nombre, ubicacion , creacion) VALUES (?, ?, ?)";

    db.query(sql,[nombre, ubicacion , creacion])
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

module.exports = router;