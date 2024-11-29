const fs = require('fs');
const db = require("../models");
const path = require('path');

// Obtener un Paquete Turístico por ID
exports.getPaqueteTuristico = async (req, res) => {
    const id = req.params.id;
    try {
        const data = await db.paqueteturistico.findByPk(id);
        res.json(data);
    } catch (error) {
        res.status(500).json({
            message: error.message || `Error retrieving PaqueteTuristico with id=${id}`
        });
    }
}

// Listar todos los Paquetes Turísticos
exports.listPaqueteTuristico = async (req, res) => {
    try {
        const data = await db.paqueteturistico.findAll();
        res.json(data.map(paquete => ({
            ...paquete.toJSON(),
            paqueteimagenUrl: paquete.paqueteimagenUrl // Campo calculado
        })));
    } catch (error) {
        res.status(500).json({
            message: error.message || "Error al obtener los paquetes turísticos."
        });
    }
};

// Crear un nuevo Paquete Turístico
exports.createPaqueteTuristico = async (req, res) => {
    try {
        const {
            usuarioId,
            ciudadId,
            nombre,
            precio,
            descripcion,
            latitud,
            longitud
        } = req.body;

        // Validar las imágenes
        const imagenes = req.files?.imagenes;
        if (!imagenes) {
            return res.status(400).send({ message: "El campo imágenes es requerido" });
        }

        // Asegurarse de que imagenes sea un arreglo
        const imagenesArray = Array.isArray(imagenes) ? imagenes : [imagenes];

        // Crear el paquete turístico
        const nuevoPaquete = await db.paqueteturistico.create({
            usuarioId,
            ciudadId,
            nombre,
            precio,
            descripcion,
            latitud,
            longitud
        });

        // Verificar si el directorio existe, si no, crearlo
        const directorio = path.join(__dirname, '../public/img/paqueteturistico');
        if (!fs.existsSync(directorio)) {
            fs.mkdirSync(directorio, { recursive: true });
        }

        // Subir las imágenes
        const imagenesGuardadas = [];
        for (let i = 0; i < imagenesArray.length; i++) {
            const imagen = imagenesArray[i];
            const nombreArchivo = `${nuevoPaquete.id}_${i}.png`; // Crear nombre único para cada imagen
            const rutaArchivo = path.join(directorio, nombreArchivo);
            await imagen.mv(rutaArchivo);
            imagenesGuardadas.push(nombreArchivo);
        }

        // Actualizar el paquete turístico con las imágenes guardadas
        nuevoPaquete.imagenes = imagenesGuardadas; // Guardar como un array (JSON automáticamente)
        await nuevoPaquete.save();

        res.status(201).send({
            message: "Paquete turístico creado con éxito",
            paquete: nuevoPaquete
        });
    } catch (error) {
        res.status(500).json({
            message: error.message || "Ocurrió un error al crear el paquete turístico."
        });
    }
};
