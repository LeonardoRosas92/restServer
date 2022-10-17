const path = require('path');
const fs = require('fs');
const cloudinary = require('cloudinary').v2;
cloudinary.config(process.env.CLOUDINARY_URL);

const { request, response } = require('express');
const { subirArchivo } = require('../helpers');
const { Usuario, Producto } = require('../models');

const cargarArchivo = async (req = request, res = response) => {
    try {
        //Textos
        //const nombre = await subirArchivo(req.files, ['txt', 'md'], 'textos');
        //Imagenes
        const nombre = await subirArchivo(req.files, undefined, 'img');
        res.json({ nombre });
    } catch (msg) {
        res.status(400).json({ msg })
    }
}

const actualizarImagen = async (req = request, res = response) => {
    const { id, coleccion } = req.params;
    let modelo;
    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe usuario con el id ${id}`
                })
            }
            break;
        case 'productos':
            modelo = await Producto.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe producto con el id ${id}`
                })
            }
            break;
        default:
            return res.status(500).json({ msg: 'Coleccion no permitida' })
    }
    //Limpiar images previas 
    if (modelo.img) {
        // Borrar la imagen del servidor
        const pathImagen = path.join(__dirname, '../uploads/', coleccion, modelo.img);
        if (fs.existsSync(pathImagen)) {
            fs.unlinkSync(pathImagen);
        }
    }

    const nombre = await subirArchivo(req.files, undefined, coleccion);
    modelo.img = nombre;

    await modelo.save();

    res.json(modelo);
}

const actualizarImagenCloudinary = async (req = request, res = response) => {
    const { id, coleccion } = req.params;
    let modelo;
    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe usuario con el id ${id}`
                })
            }
            break;
        case 'productos':
            modelo = await Producto.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe producto con el id ${id}`
                })
            }
            break;
        default:
            return res.status(500).json({ msg: 'Coleccion no permitida' })
    }
    //Limpiar images previas 
    if (modelo.img) {
        // Borrar la imagen del servidor
        const nombreArr = modelo.img.split('/');
        const nombre = nombreArr[nombreArr.length - 1];
        const [public_id] = nombre.split('.');
        cloudinary.uploader.destroy(public_id);
    }
    const { tempFilePath } = req.files.archivo;
    const { secure_url } = await cloudinary.uploader.upload(tempFilePath);
    modelo.img = secure_url;

    await modelo.save();

    res.json(modelo);
}

const mostrarImagen = async (req = request, res = response) => {
    const { id, coleccion } = req.params;
    let modelo;
    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe usuario con el id ${id}`
                })
            }
            break;
        case 'productos':
            modelo = await Producto.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe producto con el id ${id}`
                })
            }
            break;
        default:
            return res.status(500).json({ msg: 'Coleccion no permitida' })
    }

    if (modelo.img) {
        const pathImagen = path.join(__dirname, '../uploads/', coleccion, modelo.img);
        if (fs.existsSync(pathImagen)) {
            console.log(pathImagen);
            return res.sendFile(pathImagen)
        }
    }

    const pathImagen = path.join(__dirname, '../assets/no-image.jpg');
    res.sendFile(pathImagen)
}

module.exports = {
    cargarArchivo,
    actualizarImagen,
    mostrarImagen,
    actualizarImagenCloudinary
}