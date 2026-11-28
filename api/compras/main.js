const router = require("express").Router();
const db = require("../../db/conexion");
const middleware = require("../middleware");
const {
    validarCompra,
    crearCompra,
    descontarStock,
    crearDetalle,
    crearTickets,
    guardarTotal,
} = require("./funciones");

// Comprar entradas
router.post("/", middleware, async (req, res) => {
    const usuarioId = req.user.id;
    const conexion = await db.getConnection();

    try {
        const { metodoPagoId, items } = validarCompra(req.body);

        await conexion.beginTransaction();

        const compra = await crearCompra(conexion, usuarioId, metodoPagoId);

        let total = 0;

        for (const item of items) {
            const precio = await descontarStock(conexion, item.entradaId, item.cantidad);
            const detalleId = await crearDetalle(conexion, compra.id, item.entradaId, item.cantidad, precio);
            await crearTickets(conexion, detalleId, usuarioId, item.cantidad);

            total += precio * item.cantidad;
        }

        await guardarTotal(conexion, compra.id, total);

        await conexion.commit();
        res.status(201).json({ id_compra: compra.id, codigo: compra.codigo, total });

    } catch (error) {
        await conexion.rollback();

        if (error.status) {
            return res.status(error.status).send(error.message);
        }
        if (error.code === "ER_NO_REFERENCED_ROW_2") {
            return res.status(400).send("Método de pago inválido");
        }

        console.error(error);
        res.status(500).send("Ocurrio un error");
    } finally {
        conexion.release();
    }
});

module.exports = router;