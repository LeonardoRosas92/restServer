const { Router } = require('express');
const { check } = require('express-validator');

const { login,googleSignIn } = require('../controllers/auth');
const { crearCategoria, obtenerCategorias, obtenerCategoria, actualizarCategoria, borrarCategoria } = require('../controllers/categorias');
const { existeCategoriaPorId } = require('../helpers/db-validators');

const { validarCampos,validarJWT, esAdminRole } = require('../middlewares');

const router = Router();

// Obtener todas las categorias - publico
router.get('/', obtenerCategorias);

// Obtener una categoria por Id - publico
router.get('/:id', [
    check('id', 'No es un Id de Mongo Valido').isMongoId(),
    check('id').custom(existeCategoriaPorId),
    validarCampos
],obtenerCategoria);

// Crear categoria - Privado - cualquier persona con token valido
router.post('/',[
    validarJWT,
    check('nombre','El nombre es obligatorio').not().isEmpty(),
    validarCampos
], crearCategoria );

// Actualizar categoria - Privado - cualquier persona con token valido
router.put('/:id', [
    validarJWT,
    check('id', 'No es un Id de Mongo Valido').isMongoId(),
    check('nombre','El nombre es obligatorio').not().isEmpty(),
    check('id').custom(existeCategoriaPorId),
    validarCampos
] ,actualizarCategoria);

// Borrar categoria - Privado - Admin
router.delete('/:id', [
    validarJWT,
    esAdminRole,
    check('id', 'No es un Id de Mongo Valido').isMongoId(),
    check('id').custom(existeCategoriaPorId),
    validarCampos
] ,borrarCategoria);


module.exports = router; 