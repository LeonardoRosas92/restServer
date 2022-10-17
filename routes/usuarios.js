const { Router } = require('express');
const { check } = require('express-validator');
//Middlewares
// const { validarCampos } = require('../middlewares/validar-campos');
// const { validarJWT } = require('../middlewares/validar-jwt');
// const { esAdminRole, rolesPermitidos } = require('../middlewares/validar-roles');
const {
    validarCampos,
    validarJWT,
    esAdminRole, 
    rolesPermitidos
} = require('../middlewares')
//Helpers
const { esRoleValido, emailExiste, existeUsuarioPorId } = require('../helpers/db-validators');
//Controllers
const {
    usuariosGET,
    usuariosPUT,
    usuariosPOST,
    usuariosPATCH,
    usuariosDELETE
} = require('../controllers/usuarios');

const router = Router();

router.get('/', usuariosGET);

router.post('/', [
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('password', 'El password debe de ser mas de 6 letras').isLength({ min: 6 }),
    check('correo', 'El correo no tiene el formato correcto').isEmail(),
    check('correo').custom(emailExiste),
    //check('rol', 'No es un rol valido').isIn(['ADMIN_ROLE','USER_ROLE']),
    check('rol').custom((rol) => esRoleValido(rol)),
    validarCampos
], usuariosPOST);

router.put('/:id', [
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom(existeUsuarioPorId),
    check('rol').custom(esRoleValido),
    validarCampos
] ,usuariosPUT);

router.patch('/', usuariosPATCH);

router.delete('/:id', [
    validarJWT,
    //esAdminRole,
    rolesPermitidos('ADMIN_ROLE','VENTAS_ROLE'),
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom(existeUsuarioPorId),
    validarCampos
],
usuariosDELETE);

module.exports = router;  