
const fs = require('fs');
const db = require("../models");
const path = require('path');

exports.getPropiedad = async (req, res) => {
    const id = req.params.id;
    try {
        const data = await db.propiedad.findByPk(id);
        res.json(data);
    } catch (error) {
        res.status(500).json({
            message: error.message || `Error retrieving Propiedad with id=${id}`
        });
    }
}

exports.listPropiedad = async (req, res) => {
    try {
        const data = await db.propiedad.findAll();
        res.json(data.map(prop => ({
            ...prop.toJSON(),
            propiedadimagenUrl: prop.propiedadimagenUrl // Campo calculado
        })));
    } catch (error) {
        res.status(500).json({
            message: error.message || "Error al obtener las propiedades."
        });
    }
};



exports.createPropiedad = async (req, res) => {
    try {
        const {
            usuarioId,
            ciudadId,
            nombre,
            precioPorNoche,
            cantidadCamas,
            Nsanitarios,
            cantidadHuespedes,
            wifi,
            tipoAlojamiento,
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

        // Crear la propiedad
        const nuevaPropiedad = await db.propiedad.create({
            usuarioId,
            ciudadId,
            nombre,
            precioPorNoche,
            cantidadCamas,
            Nsanitarios,
            cantidadHuespedes,
            wifi,
            tipoAlojamiento,
            descripcion,
            latitud,
            longitud
        });

        // Verificar si el directorio existe, si no, crearlo
        const directorio = path.join(__dirname, '../public/img/propiedad');
        if (!fs.existsSync(directorio)) {
            fs.mkdirSync(directorio, { recursive: true });
        }

        // Subir las imágenes
        const imagenesGuardadas = [];
        for (let i = 0; i < imagenesArray.length; i++) {
            const imagen = imagenesArray[i];
            const nombreArchivo = `${nuevaPropiedad.id}_${i}.png`; // Crear nombre único para cada imagen
            const rutaArchivo = path.join(directorio, nombreArchivo);
            await imagen.mv(rutaArchivo);
            imagenesGuardadas.push(nombreArchivo);
        }

        // Actualizar la propiedad con las imágenes guardadas
        nuevaPropiedad.imagenes = imagenesGuardadas; // Guardar como un array (JSON automáticamente)
        await nuevaPropiedad.save();

        res.status(201).send({
            message: "Propiedad creada con éxito",
            propiedad: nuevaPropiedad
        });
    } catch (error) {
        res.status(500).json({
            message: error.message || "Ocurrió un error al crear la propiedad."
        });
    }
};