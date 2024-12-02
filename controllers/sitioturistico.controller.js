const fs = require('fs');
const db = require("../models");
const path = require('path');

// Obtener un Sitio Turístico por ID
exports.getSitioTuristico = async (req, res) => {
    const id = req.params.id;
    try {
        const data = await db.sitioturistico.findByPk(id);
        if (!data) {
            return res.status(404).json({ message: `Sitio Turístico con id=${id} no encontrado.` });
        }
        res.json(data);
    } catch (error) {
        res.status(500).json({
            message: error.message || `Error al obtener el Sitio Turístico con id=${id}.`
        });
    }
};

// Listar todos los Sitios Turísticos
exports.listSitioTuristico = async (req, res) => {
    try {
        const data = await db.sitioturistico.findAll();
        res.json(data.map(sitio => ({
            ...sitio.toJSON(),
            imagenes: sitio.imagenes ? JSON.parse(sitio.imagenes) : [] // Convertir imágenes de JSON
        })));
    } catch (error) {
        res.status(500).json({
            message: error.message || "Error al obtener los Sitios Turísticos."
        });
    }
};

// Crear un nuevo Sitio Turístico
exports.createSitioTuristico = async (req, res) => {
    try {
        const {
            ciudadId,
            nombre,
            descripcion,
            latitud,
            longitud
        } = req.body;

        // Validar las imágenes
        const imagenes = req.files?.imagenes;
        if (!imagenes) {
            return res.status(400).send({ message: "El campo imágenes es requerido." });
        }

        // Asegurarse de que imagenes sea un arreglo
        const imagenesArray = Array.isArray(imagenes) ? imagenes : [imagenes];

        // Crear el sitio turístico
        const nuevoSitio = await db.sitioturistico.create({
            ciudadId,
            nombre,
            descripcion,
            latitud,
            longitud,
            createdAt: new Date(),
            updatedAt: new Date()
        });

        // Verificar si el directorio existe, si no, crearlo
        const directorio = path.join(__dirname, '../public/img/sitioturistico');
        if (!fs.existsSync(directorio)) {
            fs.mkdirSync(directorio, { recursive: true });
        }

        // Subir las imágenes
        const imagenesGuardadas = [];
        for (let i = 0; i < imagenesArray.length; i++) {
            const imagen = imagenesArray[i];
            const nombreArchivo = `${nuevoSitio.id}_${i}.png`; // Nombre único para cada imagen
            const rutaArchivo = path.join(directorio, nombreArchivo);
            await imagen.mv(rutaArchivo); // Guardar imagen en el sistema de archivos
            imagenesGuardadas.push(nombreArchivo);
        }

        // Actualizar el sitio turístico con las imágenes guardadas
        nuevoSitio.imagenes = JSON.stringify(imagenesGuardadas); // Guardar como JSON
        await nuevoSitio.save();

        res.status(201).send({
            message: "Sitio Turístico creado con éxito.",
            sitio: nuevoSitio
        });
    } catch (error) {
        res.status(500).json({
            message: error.message || "Ocurrió un error al crear el Sitio Turístico."
        });
    }
};

// Eliminar un Sitio Turístico
exports.deleteSitioTuristico = async (req, res) => {
    const id = req.params.id;
    try {
        const sitio = await db.sitioturistico.findByPk(id);
        if (!sitio) {
            return res.status(404).json({ message: `Sitio Turístico con id=${id} no encontrado.` });
        }

        // Eliminar las imágenes del sistema de archivos
        const imagenes = JSON.parse(sitio.imagenes || '[]');
        const directorio = path.join(__dirname, '../public/img/sitioturistico');
        imagenes.forEach(nombreArchivo => {
            const rutaArchivo = path.join(directorio, nombreArchivo);
            if (fs.existsSync(rutaArchivo)) {
                fs.unlinkSync(rutaArchivo);
            }
        });

        // Eliminar el registro de la base de datos
        await sitio.destroy();
        res.send({ message: "Sitio Turístico eliminado con éxito." });
    } catch (error) {
        res.status(500).json({
            message: error.message || `No se pudo eliminar el Sitio Turístico con id=${id}.`
        });
    }
};
