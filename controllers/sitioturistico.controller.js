const fs = require('fs');
const path = require('path');
const db = require("../models");

// Obtener un Sitio Turístico por ID
exports.getSitioTuristico = async (req, res) => {
    const { id } = req.params;
    try {
        const sitio = await db.sitioturistico.findByPk(id);
        if (!sitio) {
            return res.status(404).json({ message: `Sitio Turístico con id=${id} no encontrado.` });
        }
        res.json(sitio);
    } catch (error) {
        res.status(500).json({
            message: error.message || `Error al obtener el Sitio Turístico con id=${id}.`
        });
    }
};

// Listar todos los Sitios Turísticos
exports.listSitiosTuristicos = async (req, res) => {
    try {
        const sitios = await db.sitioturistico.findAll();
        res.json(sitios);
    } catch (error) {
        res.status(500).json({
            message: error.message || "Error al obtener la lista de Sitios Turísticos."
        });
    }
};

// Crear un nuevo Sitio Turístico
exports.createSitioTuristico = async (req, res) => {
    try {
        const { ciudadId, nombre, descripcion, latitud, longitud } = req.body;

        // Validar imágenes
        const imagenes = req.files?.imagenes;
        if (!imagenes) {
            return res.status(400).json({ message: "El campo imágenes es requerido." });
        }

        // Asegurar que imagenes sea un arreglo
        const imagenesArray = Array.isArray(imagenes) ? imagenes : [imagenes];

        // Crear el Sitio Turístico
        const nuevoSitio = await db.sitioturistico.create({
            ciudadId,
            nombre,
            descripcion,
            latitud,
            longitud
        });

        // Verificar y crear directorio para imágenes
        const directorio = path.join(__dirname, '../public/img/sitioturistico');
        if (!fs.existsSync(directorio)) {
            fs.mkdirSync(directorio, { recursive: true });
        }

        // Subir las imágenes
        const imagenesGuardadas = [];
        for (let i = 0; i < imagenesArray.length; i++) {
            const imagen = imagenesArray[i];
            const nombreArchivo = `${nuevoSitio.id}_${i}.png`; // Crear nombre único
            const rutaArchivo = path.join(directorio, nombreArchivo);
            await imagen.mv(rutaArchivo);
            imagenesGuardadas.push(nombreArchivo);
        }

        // Guardar las rutas de las imágenes en la base de datos
        nuevoSitio.imagenes = JSON.stringify(imagenesGuardadas);
        await nuevoSitio.save();

        res.status(201).json({
            message: "Sitio Turístico creado con éxito.",
            sitio: nuevoSitio
        });
    } catch (error) {
        res.status(500).json({
            message: error.message || "Ocurrió un error al crear el Sitio Turístico."
        });
    }
};

// Actualizar un Sitio Turístico
exports.updateSitioTuristico = async (req, res) => {
    const { id } = req.params;
    try {
        const sitio = await db.sitioturistico.findByPk(id);
        if (!sitio) {
            return res.status(404).json({ message: `Sitio Turístico con id=${id} no encontrado.` });
        }

        const { ciudadId, nombre, descripcion, latitud, longitud } = req.body;

        // Actualizar datos
        await sitio.update({ ciudadId, nombre, descripcion, latitud, longitud });

        res.json({
            message: "Sitio Turístico actualizado con éxito.",
            sitio
        });
    } catch (error) {
        res.status(500).json({
            message: error.message || `Error al actualizar el Sitio Turístico con id=${id}.`
        });
    }
};

// Eliminar un Sitio Turístico
exports.deleteSitioTuristico = async (req, res) => {
    const { id } = req.params;
    try {
        const sitio = await db.sitioturistico.findByPk(id);
        if (!sitio) {
            return res.status(404).json({ message: `Sitio Turístico con id=${id} no encontrado.` });
        }

        // Eliminar imágenes asociadas
        const directorio = path.join(__dirname, '../public/img/sitioturistico');
        const imagenes = JSON.parse(sitio.imagenes || '[]');
        imagenes.forEach(imagen => {
            const rutaArchivo = path.join(directorio, imagen);
            if (fs.existsSync(rutaArchivo)) {
                fs.unlinkSync(rutaArchivo);
            }
        });

        // Eliminar el registro
        await sitio.destroy();

        res.json({ message: "Sitio Turístico eliminado con éxito." });
    } catch (error) {
        res.status(500).json({
            message: error.message || `Error al eliminar el Sitio Turístico con id=${id}.`
        });
    }
};
