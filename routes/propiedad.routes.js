
module.exports = app => {
    const controller = require("../controllers/propiedad.controller.js");
    let router = require("express").Router();

    router.get("/", controller.listPropiedad);
    router.get("/:id", controller.getPropiedad);
    router.post("/", controller.createPropiedad);
   // router.put("/:id", controller.updatePropiedad);
   // router.delete("/:id", controller.deletePropiedad);
   // router.get("/ciudad/:id", controller.listPropiedadByCiudad);

    app.use('/api/propiedad', router);

}
