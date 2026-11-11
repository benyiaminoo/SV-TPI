function permitirRoles(...rolesPermitodos) {
    return (req , res, next) => {
        if (!req.user || !rolesPermitodos.includes(req.user.rol)) {
            return res.status(403).send("No tenes permisos para esta accion")
        }
        next();
    }
}

module.exports = permitirRoles;