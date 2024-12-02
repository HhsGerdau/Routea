module.exports = app => {
    const controller = require("../controllers/sitiosturisticos.controller.js");
    let router = require("express").Router();

    // Listar todos los Sitios Turísticos
    router.get("/", controller.listSitiosTuristicos);

    // Obtener un Sitio Turístico por ID
    router.get("/:id", controller.getSitioTuristico);

    // Crear un nuevo Sitio Turístico
    router.post("/", controller.createSitioTuristico);

    // Actualizar un Sitio Turístico
    router.put("/:id", controller.updateSitioTuristico);

    // Eliminar un Sitio Turístico
    router.delete("/:id", controller.deleteSitioTuristico);

    // Registrar las rutas bajo el prefijo `/api/sitiosturisticos`
    app.use('/api/sitiosturisticos', router);
};
