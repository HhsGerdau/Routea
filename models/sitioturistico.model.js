module.exports = (sequelize, Sequelize) => {
    const SitioTuristico = sequelize.define("sitioturistico", {
        ciudadId: {
            type: Sequelize.INTEGER,
        },
        nombre: {
            type: Sequelize.STRING,
            allowNull: false, // Aseguramos que el nombre sea obligatorio
        },
        descripcion: {
            type: Sequelize.TEXT, // Para permitir descripciones más largas
        },
        latitud: {
            type: Sequelize.STRING,
            allowNull: false, // Aseguramos que la latitud sea obligatoria
        },
        longitud: {
            type: Sequelize.STRING,
            allowNull: false, // Aseguramos que la longitud sea obligatoria
        },
        imagenes: {
            type: Sequelize.JSON, // Almacenar las imágenes como un arreglo JSON
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

                // Generar URLs completas para las imágenes
                return Array.isArray(imagenes)
                    ? imagenes.map(imagen => `https://routea-production.up.railway.app/img/sitioturistico/${imagen}`)
                    : [];
            },
        },
    });

    return SitioTuristico;
};
