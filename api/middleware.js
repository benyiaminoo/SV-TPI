const jwt = require("jsonwebtoken")
const { TOKEN_SECRET } = process.env;

function middleware(req, res, next) {
    const authorization = req.headers.authorization;

    if (!authorization) {
        console.log("Error con los permisos")
        return res.status(401).send("Sin permisos")
    }

    const token = authorization.replace(/^Bearer\s+/i, "");

    try {
        const datos = jwt.verify(token, TOKEN_SECRET);
        req.user = datos;
        next()
    } catch (error) {
        console.error(error);
        res.status(403).send("error en el token")
    }


}

module.exports = middleware