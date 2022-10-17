const { request, response } = require("express")


const esAdminRole = (req = request, res = response, next) => {
    if (!req.usuario) {
        return res.status(500).json({
            msg: 'Se quiere verificar el role sin valdiar el token existente'
        })
    }

    const { rol, nombre } = req.usuario;
    if (rol !== 'ADMIN_ROLE') {
        return res.status(401).json({
            msg: `${ nombre } no tiene perfil Administrador, no tiene permiso para realizar esta actividad.`
        })
    }

    next();
}

const rolesPermitidos  = (...roles) => {
    return (req = request, res = response, next) => {
        if (!req.usuario) {
            return res.status(500).json({
                msg: 'Se quiere verificar el role sin valdiar el token existente'
            })
        }

        if (!roles.includes(req.usuario.rol)) {
            return res.status(401).json({
                msg: `El rol no tiene permisos para esta actividad`
            })
        }
        next();
    }
}

module.exports = {
    esAdminRole,
    rolesPermitidos
}