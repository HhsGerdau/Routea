const dbConfig = require("../config/db.config");
const Sequelize = require("sequelize");

const sequelize = new Sequelize(
    dbConfig.DB,
    dbConfig.USER,
    dbConfig.PASSWORD,
    {
        host: dbConfig.HOST,
        dialect: dbConfig.dialect,
    }
);

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;



db.usuario = require("./usuario.model")(sequelize, Sequelize);
db.propiedad = require("./propiedad.model")(sequelize, Sequelize);
db.ciudad = require("./ciudad.model")(sequelize, Sequelize);
db.reserva = require("./reserva.model")(sequelize, Sequelize);
db.paqueteturistico = require("./paquetesturisticos.model")(sequelize, Sequelize);


db.ciudad.hasMany(db.propiedad, { foreignKey: "ciudadId", onDelete: "CASCADE" });
db.propiedad.belongsTo(db.ciudad, { foreignKey: "ciudadId" });

db.usuario.hasMany(db.propiedad, { foreignKey: "usuario_id", onDelete: "CASCADE" });
db.propiedad.belongsTo(db.usuario, { foreignKey: "usuario_id" });

db.usuario.hasMany(db.reserva, { foreignKey: "usuario_id", onDelete: "CASCADE" });
db.reserva.belongsTo(db.usuario, { foreignKey: "usuario_id" });

db.propiedad.hasMany(db.reserva, { foreignKey: "propiedadId", onDelete: "CASCADE" });
db.reserva.belongsTo(db.propiedad, { foreignKey: "propiedadId" });

db.usuario.hasMany(db.paqueteturistico, { foreignKey: "usuario_id", onDelete: "CASCADE" });
db.paqueteturistico.belongsTo(db.usuario, { foreignKey: "usuario_id" });

db.ciudad.hasMany(db.paqueteturistico, { foreignKey: "ciudadId", onDelete: "CASCADE" });
db.paqueteturistico.belongsTo(db.ciudad, { foreignKey: "ciudadId" });

//paque turistico con reserva
db.paqueteturistico.hasMany(db.reserva, { foreignKey: "paqueteId", onDelete: "CASCADE" });
db.reserva.belongsTo(db.paqueteturistico, { foreignKey: "paqueteId" });




db.tokens = require("./usuarioauth.model")(sequelize, Sequelize);
db.usuario.hasMany(db.tokens, { as: "tokens", foreignKey: "usuario_id", onDelete: "CASCADE" });
db.tokens.belongsTo(db.usuario, {
    foreignKey: "usuario_id",
    as: "usuario",
});


module.exports = db;