module.exports = app => {
    const controller = require("../controllers/ciudad.controller.js");
    let router = require("express").Router();


    router.get("/", controller.listCiudad);
    router.get("/:id", controller.getCiudad);
    router.post("/", controller.createCiudad);
    router.put("/:id", controller.updateCiudad);
    router.delete("/:id", controller.deleteCiudad);
    




    app.use('/api/ciudad', router);

}