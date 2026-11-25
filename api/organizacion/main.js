const router = require("express").Router()
const db = require('../../db/conexion');
const esSocio = require("../esSocio");

const perteneceAORG = require("../pertenece")

const middleware = require("../middleware")

const ROL_DUENO = 1;

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



// Organizaciones a las que pertenece el usuario logueado
router.get("/mias", middleware, (req, res) => {
    console.log("usuario del token:", req.user);
    const sql = `
        SELECT
            organizaciones.id_org,
            organizaciones.nombre,
            organizaciones.ubicacion,
            organizaciones.creacion,
            organizaciones.portada,
            usuariosOrganizaciones.rol_id
        FROM usuariosOrganizaciones
        JOIN organizaciones
            ON organizaciones.id_org = usuariosOrganizaciones.organizacion_id
        WHERE usuariosOrganizaciones.usuario_id = ?
            AND organizaciones.activo = 1`;

    db.query(sql, [req.user.id])
        .then(([filas]) => res.status(200).json(filas))
        .catch((error) => {
            console.error(error);
            res.status(500).send("Ocurrio un error");
        });
});

router.get("/mias/:orgId", middleware, perteneceAORG(), async (req, res, nex) => {

    try {
        const [filas] = await db.query(
            `SELECT id_org, nombre, ubicacion, creacion, portada
         FROM organizaciones
         WHERE id_org = ?`,
            [req.org.id]
        )

        if (filas.length === 0) {
            return res.status(404).send("Organización no encontrada");
        }
        res.status(200).json(filas[0]);
    } catch (error) {
        console.error(error);
        res.status(500).send("Ocurrió un error");
    }
})

//Obtener ORGS por id usuario
router.get("/user", middleware, (req, res, next) => {

    const usuarioId = req.user.id; //token

    const sql = "SELECT o.id_org, o.nombre, o.ubicacion, o.portada FROM organizaciones o INNER JOIN usuariosOrganizaciones u ON o.id_org = u.organizacion_id WHERE u.usuario_id = ?"


    db.query(sql, [usuarioId])
        .then(([rows]) => {
            res.status(200).json(rows)
            console.log("Se trajo a la organizacion DEL TOUKEN PADRE")
        })
        .catch((error) => {
            console.error(error);
            res.status(500).send("Ocurrio un error")
        })
})

//obtener organizacion por id
router.get("/:id", (req, res, next) => {
    const { id } = req.params
    const sql = "SELECT * FROM organizaciones WHERE id_org = ?"

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
router.post("/crear", middleware, esSocio, async (req, res, next) => {
    const { nombre, ubicacion } = req.body
    const creacion = new Date().toISOString().split("T")[0];

    const usuarioId = req.user.id; //token

    const conexion = await db.getConnection();

    try {
        await conexion.beginTransaction();

        const [resultado] = await conexion.query(
            "INSERT INTO organizaciones (nombre, ubicacion, creacion) VALUES (?, ?, ?)",
            [nombre, ubicacion, creacion]
        );

        const organizacionId = resultado.insertId;

        await conexion.query(
            "INSERT INTO usuariosOrganizaciones (usuario_id, organizacion_id, rol_id) VALUES (?, ?, ?)",
            [usuarioId, organizacionId, ROL_DUENO]
        )

        await conexion.commit();
        res.status(201).json({ id_organizacion: organizacionId, nombre: nombre })
    } catch (error) {
        await conexion.rollback();
        console.error(error);
        res.status(500).send("Ocurrio un error");
    } finally {
        conexion.release();
    }
}

)


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