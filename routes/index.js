module.exports = app => {
    // rutas de acceso
    require("./auth.routes")(app);
    require("./usuario.routes")(app);
    require("./ciudad.routes")(app);
    require("./propiedad.routes")(app);
    require("./reserva.routes")(app);
    require("./paquetesturisticos.routes")(app);
    require("./paquetereserva.routes")(app);
    

   

}