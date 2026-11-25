const router = require("express").Router();
const db = require("../../db/conexion")
const middleware = require("../middleware")


router.post("/", middleware, (req, res) => {    
    
    db.query("UPDATE usuarios SET socio = 1 WHERE id_usuario = ?", [req.user.id])
        .then(() => res.status(200).send("Membresia activada"))
        .catch((error) => {
            console.error(error);
            res.status(500).send("Ocurrio un error");
        });
});

// ¿El usuario logueado ya es socio?
router.get("/estado", middleware, (req, res) => {
    db.query("SELECT socio FROM usuarios WHERE id_usuario = ?", [req.user.id])
        .then(([filas]) => res.status(200).json({ socio: filas[0]?.socio === 1 }))
        .catch((error) => {
            console.error(error);
            res.status(500).send("Ocurrio un error");
        });
});

module.exports = router;