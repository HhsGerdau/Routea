module.exports = (sequelize, Sequelize) => {
    const Propiedad = sequelize.define("propiedad", {
        usuarioId: {
            type: Sequelize.INTEGER,
        },
        ciudadId: {
            type: Sequelize.INTEGER,
        },
        nombre: {
            type: Sequelize.STRING,
        },
        precioPorNoche: {
            type: Sequelize.DECIMAL(10, 2),
        },
        cantidadCamas: {
            type: Sequelize.INTEGER,
        },
        Nsanitarios: {
            type: Sequelize.INTEGER,
        },
        cantidadHuespedes: {
            type: Sequelize.INTEGER,
        },
        wifi: {
            type: Sequelize.BOOLEAN,
        },
        tipoAlojamiento: {
            type: Sequelize.STRING,
        },
        descripcion: {
            type: Sequelize.TEXT,
        },
        latitud: {
            type: Sequelize.STRING,
        },
        longitud: {
            type: Sequelize.STRING,
        },
        imagenes: {
            type: Sequelize.JSON,  // Usamos JSON para almacenar las imágenes como arreglo
        },
        propiedadimagenUrl: {
            type: Sequelize.VIRTUAL,
            get() {
                const rawImagenes = this.getDataValue('imagenes');
                let imagenes;
        
                // Manejar diferentes formatos de almacenamiento
                try {
                    imagenes = typeof rawImagenes === 'string' ? JSON.parse(rawImagenes) : rawImagenes || [];
                } catch {
                    imagenes = [];
                }
        
                return Array.isArray(imagenes)
                    ? imagenes.map(imagen => `http://localhost:3001/img/propiedad/${imagen}`)
                    : [];
            },
        },
        
    });
    return Propiedad;
};
