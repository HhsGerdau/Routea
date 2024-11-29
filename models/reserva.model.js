module.exports = (sequelize, Sequelize) => {
    const Reserva = sequelize.define("reserva", {
        usuarioId: {
            type: Sequelize.INTEGER,
        },
        propiedadId: {
            type: Sequelize.INTEGER,
        },
        paqueteId: {
            type: Sequelize.INTEGER,
        },
        fechaInicio: {
            type: Sequelize.DATE,
        },
        fechaFin: {
            type: Sequelize.DATE,
        },
        estado: {
            type: Sequelize.STRING,
            defaultValue: "pendiente", // Puede ser 'pendiente', 'pagado', 'cancelado'
        },
        montoTotal: {
            type: Sequelize.DECIMAL(10, 2),
        },
    });
    return Reserva;
};
