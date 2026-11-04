const router = require("express").Router();

const usuariosRouter = require('./usuarios/main');
const LoginRouter = require('./usuarios/login');
const organizacionRouter = require('./organizacion/main');
const publicacionRouter = require('./publicaciones/main');
const eventosRouter = require("./eventos/main");


const middleware = require("./middleware")

router.use("/usuarios", usuariosRouter);
router.use("/org", organizacionRouter);
router.use("/login", LoginRouter);
router.use("/publicaciones", publicacionRouter);
router.use("/eventos", eventosRouter);

router.get("/", (req, res, next) => {
    res.send("Endpoint de API");
})

module.exports = router;