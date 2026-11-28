// api/entradas/main.js
const router = require("express").Router({ mergeParams: true }); // esto permite ver el parametro del padre evento
const db = require("../../db/conexion");
const middleware = require("../middleware");
const perteneceAEvento = require("../perteneceAEvento");

// Valida y limpia los datos que llegan del cliente
function validarEntrada({ nombre, precio, cantidad }) {
    const precioNumero = Number(precio);
    const cantidadNumero = Number(cantidad);

    if (typeof nombre !== "string" || !nombre.trim()) {
        return { error: "El nombre es obligatorio" };
    }
    if (!Number.isInteger(precioNumero) || precioNumero < 0) {
        return { error: "El precio debe ser un número entero mayor o igual a 0" };
    }
    if (!Number.isInteger(cantidadNumero) || cantidadNumero < 0) {
        return { error: "La cantidad debe ser un número entero mayor o igual a 0" };
    }

    return {
        datos: { nombre: nombre.trim(), precio: precioNumero, cantidad: cantidadNumero },
    };
}

// Listar las entradas de un evento (público)
router.get("/", (req, res) => {
    const { eventoId } = req.params;

    const sql = "SELECT id_entrada, nombre, precio, cantidad FROM entradas WHERE evento_id = ?";

    db.query(sql, [eventoId])
        .then(([filas]) => res.status(200).json(filas))
        .catch((error) => {
            console.error(error);
            res.status(500).send("Ocurrio un error");
        });
});

// Crear una entrada
router.post("/", middleware, perteneceAEvento(), (req, res) => {
    const { eventoId } = req.params;
    const { error, datos } = validarEntrada(req.body);

    if (error) return res.status(400).send(error);

    const sql = "INSERT INTO entradas (nombre, precio, evento_id, cantidad) VALUES (?, ?, ?, ?)";

    db.query(sql, [datos.nombre, datos.precio, eventoId, datos.cantidad])
        .then(([resultado]) => res.status(201).json({ id_entrada: resultado.insertId }))
        .catch((err) => {
            if (err.code === "ER_DUP_ENTRY") {
                return res.status(409).send("Ya existe una entrada con ese nombre en este evento");
            }
            console.error(err);
            res.status(500).send("Ocurrio un error");
        });
});

// Modificar una entrada
router.put("/:id", middleware, perteneceAEvento(), (req, res) => {
    const { eventoId, id } = req.params;
    const { error, datos } = validarEntrada(req.body);

    if (error) return res.status(400).send(error);

    const sql = `UPDATE entradas
                 SET nombre = ?, precio = ?, cantidad = ?
                 WHERE id_entrada = ? AND evento_id = ?`;

    db.query(sql, [datos.nombre, datos.precio, datos.cantidad, id, eventoId])
        .then(([resultado]) => {
            if (resultado.affectedRows === 0) {  // nose modifico nada ,significa que la entrada no existe
                return res.status(404).send("Entrada no encontrada");
            }
            res.status(200).send("Entrada actualizada");
        })
        .catch((err) => {
            if (err.code === "ER_DUP_ENTRY") {
                return res.status(409).send("Ya existe una entrada con ese nombre en este evento");
            }
            console.error(err);
            res.status(500).send("Ocurrio un error");
        });
});

// Eliminar una entrada
router.delete("/:id", middleware, perteneceAEvento(), (req, res) => {
    const { eventoId, id } = req.params;

    db.query("DELETE FROM entradas WHERE id_entrada = ? AND evento_id = ?", [id, eventoId])
        .then(([resultado]) => {
            if (resultado.affectedRows === 0) {
                return res.status(404).send("Entrada no encontrada");
            }
            res.status(200).send("Entrada eliminada");
        })
        .catch((err) => {
            if (err.code === "ER_ROW_IS_REFERENCED_2") {
                return res.status(409).send("No se puede eliminar: la entrada ya tiene ventas");
            }
            console.error(err);
            res.status(500).send("Ocurrio un error");
        });
});

module.exports = router;