module.exports = (sequelize, Sequelize) => {
    const SitioTuristico = sequelize.define("sitioturistico", {
        ciudadId: {
            type: Sequelize.INTEGER,
        },
        nombre: {
            type: Sequelize.STRING,
            allowNull: false,
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
            type: Sequelize.JSON,
        },
        sitioImagenUrl: {
            type: Sequelize.VIRTUAL,
            get() {
                const rawImagenes = this.getDataValue('imagenes');
                let imagenes;

                try {
                    imagenes = typeof rawImagenes === 'string' ? JSON.parse(rawImagenes) : rawImagenes || [];
                } catch {
                    imagenes = [];
                }

                // Generar las URLs completas de las imágenes
                return Array.isArray(imagenes)
                    ? imagenes.map(imagen => `https://routea-production.up.railway.app/img/sitioturistico/${imagen}`)
                    : [];
            },
        },
    });

    return SitioTuristico;
};
