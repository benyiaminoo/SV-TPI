const router = require("express").Router();
const db = require("../../db/conexion")
const middleware = require("../middleware")
const { crearToken } = require("../usuarios/funciones")


router.post("/", middleware, async (req, res) => {    
    try {

        await db.query("UPDATE usuarios SET socio = 1 WHERE id_usuario = ?", [req.user.id]);
        
        const [filas] = await db.query(
            "SELECT id_usuario, nombre, rol, socio FROM usuarios WHERE id_usuario = ?",
            [req.user.id]
        )
        const token = crearToken(filas[0]);   // token nuevo, ya con socio: true
        res.status(200).json({ token });
    } catch (error) {
        console.error(error);
        res.status(500).send("Ocurrio un error");
    }
    

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