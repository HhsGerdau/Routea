module.exports = (sequelize, Sequelize) => {
    const Usuario = sequelize.define("usuario", {
        nombreCompleto: {
            type: Sequelize.STRING,
        },
        telefono: {
            type: Sequelize.INTEGER
        },
        email: {
            type: Sequelize.STRING
        },
        password: {
            type: Sequelize.STRING
        },
        esAdmin: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        }
    });
    return Usuario;
};