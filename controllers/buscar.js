const { request, response } = require("express");
const { Usuario, Categoria, Producto } = require("../models");
const { ObjectId } = require('mongoose').Types;
const coleccionesPermitidas = [
    'usuarios',
    'categorias',
    'productos',
    'roles'
];

const buscarUsuarios = async (termino = '', res = response) => {
    const esMongoID = ObjectId.isValid(termino);
    console.log(termino);
    if (esMongoID) {
        const usuario = await Usuario.findById(termino);
        return res.json({
            results: (usuario) ? [usuario] : []
        })
    }

    const regex = new RegExp(termino, 'i');

    const usuarios = await Usuario.find({
        $or: [{ nombre: regex }, { correo: regex }],
        $and: [{ estado: true }]
    })
    res.json({
        results: (usuarios) ? [usuarios] : []
    })
}

const buscarCategorias = async (termino = '', res = response) => {
    const esMongoID = ObjectId.isValid(termino);
    console.log(termino);
    if (esMongoID) {
        const categoria = await Categoria.findById(termino);
        return res.json({
            results: (categoria) ? [categoria] : []
        })
    }

    const regex = new RegExp(termino, 'i');

    const categorias = await Categoria.find({
        $or: [{ nombre: regex }],
        $and: [{ estado: true }]
    })
    console.log(categorias);
    res.json({
        results: categorias
    })
}

const buscarProductos = async (termino = '', res = response) => {
    const esMongoID = ObjectId.isValid(termino);
    console.log(termino);
    if (esMongoID) {
        const producto = await Producto.findById(termino)
                                .populate('categoria','nombre');
        return res.json({
            results: (producto) ? [producto] : []
        })
    }

    const regex = new RegExp(termino, 'i');

    const productos = await Producto.find({
        $or: [{ nombre: regex }],
        $and: [{ estado: true }]
    }).populate('categoria','nombre');
    return res.json({
        results: (productos) ? [productos] : []
    })
}
const buscar = (req = request, res = response) => {
    const { coleccion, termino } = req.params;
    if (!coleccionesPermitidas.includes(coleccion)) {
        return res.status(400).json({
            msg: `Las colecciones permitidas son: ${coleccionesPermitidas}`
        })
    }

    switch (coleccion) {
        case 'usuarios':
            buscarUsuarios(termino, res);
            break;
        case 'categorias':
            buscarCategorias(termino, res);
            break;
        case 'productos':
            buscarProductos(termino, res);
            break;
        default:
            return res.status(500).json({
                msg: `Esta busqueda no se encuentra implementada`
            })
    }
}

module.exports = {
    buscar
}