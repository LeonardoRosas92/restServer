const { Router } = require('express');
const { check } = require('express-validator');

const { login, googleSignIn } = require('../controllers/auth');
const { 
    crearProducto, 
    obtenerProductos, 
    obtenerProducto, 
    actualizarProducto, 
    borrarProducto } = require('../controllers/productos');

const { existeCategoriaPorId, existeProductoPorId, existeProductoPorNombre } = require('../helpers/db-validators');

const { validarCampos, validarJWT, esAdminRole } = require('../middlewares');

const router = Router();

// Obtener todas las categorias - publico
router.get('/', obtenerProductos);

// Obtener una categoria por Id - publico
router.get('/:id', [
    check('id', 'No es un Id de Mongo Valido').isMongoId(),
    check('id').custom(existeProductoPorId),
    validarCampos
], obtenerProducto);

// Crear categoria - Privado - cualquier persona con token valido
router.post('/', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('categoria', 'No es un id de Mongo').isMongoId(),
    check('categoria').custom(existeCategoriaPorId),
    check('nombre').custom(existeProductoPorNombre),
    validarCampos
], crearProducto);

// Actualizar categoria - Privado - cualquier persona con token valido
router.put('/:id', [
    validarJWT,
    //check('categoria', 'No es un Id de Mongo Valido').isMongoId(),
    check('id').custom(existeProductoPorId),
    validarCampos
], actualizarProducto);

// Borrar categoria - Privado - Admin
router.delete('/:id', [
    validarJWT,
    esAdminRole,
    check('id', 'No es un Id de Mongo Valido').isMongoId(),
    check('id').custom(existeProductoPorId),
    validarCampos
], borrarProducto);


module.exports = router; 