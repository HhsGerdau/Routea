module.exports = (sequelize, Sequelize) => {
    const Ciudad = sequelize.define("ciudad", {
        nombre: {
            type: Sequelize.STRING,
        },
    });
    return Ciudad;
};
