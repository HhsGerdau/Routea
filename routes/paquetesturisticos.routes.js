module.exports = app => {
    const controller = require("../controllers/paquetesturisticos.controller.js");
    let router = require("express").Router();



    router.get("/", controller.listPaqueteTuristico);
    router.get("/:id", controller.getPaqueteTuristico);
    router.post("/", controller.createPaqueteTuristico);
   // router.put("/:id", controller.updatePaqueteTuristico);



    app.use('/api/paquetesturisticos', router);

    

}