module.exports = (sequelize, Sequelize) => {
    const PaqueteTuristico = sequelize.define("paqueteturistico", {
        usuarioId: {
            type: Sequelize.INTEGER,
        },
        ciudadId: {
            type: Sequelize.INTEGER,
        },
        nombre: {
            type: Sequelize.STRING,
        },
        precio: {
            type: Sequelize.DECIMAL(10, 2),
        },
        descripcion: {
            type: Sequelize.STRING,
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
        paqueteimagenUrl: {
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

                // Retornar las URLs de las imágenes almacenadas
                return Array.isArray(imagenes)
                    ? imagenes.map(imagen => `http://localhost:3001/img/paqueteturistico/${imagen}`)
                    : [];
            },
        },
    });

    return PaqueteTuristico;
};
