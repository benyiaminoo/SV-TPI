const db = require("../db/conexion");

function perteneceAEvento(...rolesPermitidos) {
    return async (req, res, next) => {
        const { eventoId } = req.params;

        try {
            const [filas] = await db.query(
                `SELECT
                    eventos.organizacion_id,
                    usuariosOrganizaciones.rol_id
                 FROM eventos
                 JOIN usuariosOrganizaciones
                    ON usuariosOrganizaciones.organizacion_id = eventos.organizacion_id
                 WHERE eventos.id_evento = ?
                    AND usuariosOrganizaciones.usuario_id = ?`,
                [eventoId, req.user.id]
            );

            if (filas.length === 0) {
                return res.status(403).send("No tenés permisos sobre este evento");
            }

            const rolId = filas[0].rol_id;
            if (rolesPermitidos.length > 0 && !rolesPermitidos.includes(rolId)) {
                return res.status(403).send("No tenés permisos sobre este evento");
            }

            req.org = { id: filas[0].organizacion_id, rol_id: rolId };
            next();
        } catch (error) {
            console.error(error);
            res.status(500).send("Ocurrio un error");
        }
    };
}

module.exports = perteneceAEvento;