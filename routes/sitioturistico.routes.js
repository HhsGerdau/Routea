module.exports = app => {
    const controller = require("../controllers/sitioturistico.controller.js");
    let router = require("express").Router();

    // Listar todos los sitios turísticos
    router.get("/", controller.listSitioTuristico);

    // Obtener un sitio turístico por ID
    router.get("/:id", controller.getSitioTuristico);

    // Crear un nuevo sitio turístico
    router.post("/", controller.createSitioTuristico);

    // Eliminar un sitio turístico por ID
    router.delete("/:id", controller.deleteSitioTuristico);

    // Registrar las rutas con el prefijo '/api/sitiosturisticos'
    app.use('/api/sitioturistico', router);
};
