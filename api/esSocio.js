const db = require("../db/conexion");

async function esSocio(req, res, next) {
    try {
        const [filas] = await db.query(
            "SELECT socio FROM usuarios WHERE id_usuario = ?",
            [req.user.id]
        );

        if (filas.length === 0 || filas[0].socio !== 1) {
            return res.status(403).send("Necesitás la membresía de socio");
        }

        next();
    } catch (error) {
        console.error(error);
        res.status(500).send("Ocurrio un error");
    }
}

module.exports = esSocio;