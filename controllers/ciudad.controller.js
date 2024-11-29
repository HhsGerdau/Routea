const db = require("../models");

exports.getCiudad = async (req, res) => {
    const id = req.params.id;
    try {
        const data = await db.ciudad.findByPk(id);
        res.json(data);
    } catch (error) {
        res.status(500).json({
            message: error.message || `Error retrieving Ciudad with id=${id}`
        });
    }
}



exports.listCiudad = async (req, res) => {
    try {
        const data = await db.ciudad.findAll();
        res.json(data);
    } catch (error) {
        res.status(500).json({
            message: error.message || "Some error occurred while retrieving Ciudad."
        });
    }
}

exports.createCiudad = async (req, res) => {
    const { nombre } = req.body;
    if (!nombre) {
        res.status(400).send({
            message: "El campo nombre no puede estar vacío"
        });
        return;
    }
    try {
        const data = await db.ciudad.create({ nombre });
        res.json(data);
    } catch (error) {
        res.status(500).json({
            message: error.message || "Some error occurred while creating the Ciudad."
        });
    }
}


exports.updateCiudad = async (req, res) => {
    const id = req.params.id;
    const { nombre } = req.body;
    try {
        const data = await db.ciudad.update({ nombre }, {
            where: { id }
        });
        res.json(data);
    } catch (error) {
        res.status(500).json({
            message: error.message || `Error updating Ciudad with id=${id}`
        });
    }
}

exports.deleteCiudad = async (req, res) => {
    const id = req.params.id;
    try {
        const data = await db.ciudad.destroy({
            where: { id }
        });
        res.json(data);
    } catch (error) {
        res.status(500).json({
            message: error.message || `Error deleting Ciudad with id=${id}`

        });
    }
}

