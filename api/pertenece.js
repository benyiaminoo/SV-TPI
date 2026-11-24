const db = require("../db/conexion")

function perteneceAORG(...rolesPermitidos) {
    return async (req, res, next) => {
        const organizacionId = req.params.orgId ?? req.body.organizacion_id;

        if (!organizacionId) {
            return res.status(400).send("Falta la organizacion")
        }

        try {

            const [rows] = await db.query(
                "SELECT rol_id FROM usuariosOrganizaciones WHERE usuario_id = ? AND organizacion_id = ?",
                [req.user.id, organizacionId]
            );

            if (rows.length === 0) {
                return res.status(403).send("No pertenecés a esta organización");
            }

            const rolId = rows[0].rol_id;
            if (rolesPermitidos.length > 0 && !rolesPermitidos.includes(rolId)) {
                return res.status(403).send("No tenés permisos en esta organización");
            }

            req.org = { id: Number(organizacionId), rol_id: rolId };
            next();
        } catch (error) {
            console.error(error);
            res.status(500).send("Ocurrio un error");
        }

    }

}
module.exports = perteneceAORG;