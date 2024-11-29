module.exports = app => {
    const controller = require("../controllers/reserva.controller.js");
    let router = require("express").Router();

   // router.get("/", controller.listReserva);
  //  router.get("/:id", controller.getReserva);
    router.post("/", controller.createReserva);
   // router.put("/:id", controller.updateReserva);
   router.post("/confirmar", controller.confirmReserva);

    app.use('/api/reserva', router);

}