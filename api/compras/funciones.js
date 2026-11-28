const crypto = require("crypto");

// Crea un error y le pega el código de respuesta (400, 404, 409...)
function crearError(status, mensaje) {
    const error = new Error(mensaje);
    error.status = status;
    return error;
}

// Número aleatorio de 9 dígitos
function generarCodigo() {
    return crypto.randomInt(100000000, 1000000000);
}

// Revisa que el pedido venga bien armado y lo devuelve ordenado
function validarCompra(body = {}) {
    const metodoPagoId = Number(body.metodopago_id);

    if (!Number.isInteger(metodoPagoId)) {
        throw crearError(400, "Falta el método de pago");
    }

    if (!Array.isArray(body.items) || body.items.length === 0) {
        throw crearError(400, "La compra no tiene entradas");
    }

    const items = [];

    for (const item of body.items) {
        const entradaId = Number(item.entrada_id);
        const cantidad = Number(item.cantidad);

        if (!Number.isInteger(entradaId) || !Number.isInteger(cantidad) || cantidad < 1) {
            throw crearError(400, "Cada entrada necesita entrada_id y una cantidad entera mayor a 0");
        }

        items.push({ entradaId, cantidad });
    }

    return { metodoPagoId, items };
}

// Crea la compra (el total se completa al final)
async function crearCompra(conexion, usuarioId, metodoPagoId) {
    const codigo = generarCodigo();

    const [resultado] = await conexion.query(
        "INSERT INTO compras (codigo, usuario_id, metodopago_id, fecha, total) VALUES (?, ?, ?, NOW(), 0)",
        [codigo, usuarioId, metodoPagoId]
    );

    return { id: resultado.insertId, codigo };
}

// Descuenta el stock de una entrada y devuelve su precio
async function descontarStock(conexion, entradaId, cantidad) {
    const [filas] = await conexion.query(
        "SELECT nombre, precio FROM entradas WHERE id_entrada = ?",
        [entradaId]
    );

    if (filas.length === 0) {
        throw crearError(404, `La entrada ${entradaId} no existe`);
    }

    // Descuenta solo si alcanza el stock. Si no alcanza, no modifica ninguna fila.
    const [resultado] = await conexion.query(
        "UPDATE entradas SET cantidad = cantidad - ? WHERE id_entrada = ? AND cantidad >= ?",
        [cantidad, entradaId, cantidad]
    );

    if (resultado.affectedRows === 0) {
        throw crearError(409, `No hay stock suficiente de "${filas[0].nombre}"`);
    }

    return filas[0].precio;
}

// Crea el detalle de la compra (una fila por tipo de entrada)
async function crearDetalle(conexion, compraId, entradaId, cantidad, precioUnitario) {
    const subtotal = precioUnitario * cantidad;

    const [resultado] = await conexion.query(
        `INSERT INTO detalle_compras (compra_id, entrada_id, cantidad, precio_unitario, subtotal)
         VALUES (?, ?, ?, ?, ?)`,
        [compraId, entradaId, cantidad, precioUnitario, subtotal]
    );

    return resultado.insertId;
}

// Crea un ticket por cada entrada comprada
async function crearTickets(conexion, detalleId, usuarioId, cantidad) {
    for (let i = 0; i < cantidad; i++) {
        await conexion.query(
            "INSERT INTO tickets (codigo, detalle_id, usuario_id, estado) VALUES (?, ?, ?, ?)",
            [generarCodigo(), detalleId, usuarioId, "valido"]
        );
    }
}

// Guarda el total final de la compra
async function guardarTotal(conexion, compraId, total) {
    await conexion.query(
        "UPDATE compras SET total = ? WHERE id_compra = ?",
        [total, compraId]
    );
}

module.exports = {
    validarCompra,
    crearCompra,
    descontarStock,
    crearDetalle,
    crearTickets,
    guardarTotal,
};