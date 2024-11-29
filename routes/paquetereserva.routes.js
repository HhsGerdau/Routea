module.exports = app => {
    const controller = require("../controllers/reservapaqueteturistico.controller.js");
    let router = require("express").Router();

    // Ruta para crear una reserva de paquete turístico
    router.post("/", controller.createReservaPaquete);

    // Ruta para confirmar la reserva de paquete turístico
    router.post("/confirmar", controller.confirmReservaPaquete);

    app.use('/api/reserva/paquete', router);
};
