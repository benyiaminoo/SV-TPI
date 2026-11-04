const router = require("express").Router()
const db = require('../../db/conexion')

const middleware = require("../middleware")

//obtener publicaciones
router.get("/", (req, res, next) => {

    const sql = "SELECT * FROM publicaciones"

    db.query(sql)
        .then(([rows]) => {
            res.status(200).json(rows)
            console.log("Se trajeron las publicaciones")
        })
        .catch((error) => {
            console.error(error);
            res.status(500).send("Ocurrio un error")
        })
})

//obtener publicaciones por id
router.get("/:id", (req, res, next) => {
    const { id } = req.params
    const sql = "SELECT * FROM publicaciones WHERE id_publicacion = ?"

    db.query(sql, [id])
        .then(([rows]) => {
            res.status(200).json(rows)
            console.log("Se trajeron las publicaciones")
        })
        .catch((error) => {
            console.error(error);
            res.status(500).send("Ocurrio un error")
        })
})

//obtener publicaciones por id de organizacion
router.get("/org/:id", (req, res, next) => {
    const { id } = req.params
    const sql = "SELECT * FROM publicaciones WHERE organizador_id = ?"

    db.query(sql, [id])
        .then(([rows]) => {
            res.status(200).json(rows)
            console.log("Se trajeron las publicaciones")
        })
        .catch((error) => {
            console.error(error);
            res.status(500).send("Ocurrio un error")
        })
})


//crear publicaciones con autorizacion
router.post("/crear", middleware, (req, res, next) => {
    const { titulo, descripcion, img_url, organizador_id, activo } = req.body

    const sql = "INSERT INTO publicaciones (titulo, descripcion, img_url, organizador_id, activo) VALUES (?, ?, ?, ? ,?)";

    db.query(sql, [titulo, descripcion, img_url, organizador_id, activo])
        .then(() => {
            res.status(201).send("Publicacion creada")
            console.log("Se creó una publicacion")
        })
        .catch((error) => {
            console.error(error);
            res.status(500).send("Ocurrio un error")
        })
})


//eliminar organizacion
router.delete("/:id", middleware, (req, res, next) => {
    const { id } = req.params

    const sql = "UPDATE publicaciones SET activo = 0 WHERE id_publicacion= ?";

    db.query(sql, [id])
        .then(() => {
            res.status(201).send("Publicacion Eliminada")
            console.log("Se eliminó una publicacion")
        })
        .catch((error) => {
            console.error(error);
            res.status(500).send("Ocurrio un error")
        })

})

//actualizar organizacion
router.put("/:id", middleware, (req, res, next) => {
    const { id } = req.params;
    const { titulo, descripcion, img_url, organizador_id, activo } = req.body

    const sql = "UPDATE publicaciones SET titulo = ?, descripcion = ?, img_url = ?, organizador_id = ?, activo = ? WHERE id_publicacion = ?"

    db.query(sql, [titulo, descripcion, img_url, organizador_id, activo, id])
        .then(() => {
            res.status(201).send("Publicación actualizada")
            console.log("Se actualizó una publicacion")
        })
        .catch((error) => {
            console.error(error);
            res.status(500).send("Ocurrio un error")
        })
})



module.exports = router;