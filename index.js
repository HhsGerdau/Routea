const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const session = require('express-session');
require('dotenv').config(); 

const app = express();
const port = process.env.PORT || 57715;

const corsOptions = {
    origin: ['http://localhost:5173','https://routea.netlify.app', 'https://bright-florentine-19205c.netlify.app'],
    credentials:true,
};
app.use(cors(corsOptions));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.use(fileUpload({
    limits: { fileSize: 10 * 1024 * 1024 }, // Limitar tamaño de archivo a 10MB
}));

// Carpetas estáticas
app.use(express.static('public'));

// Manejo de errores de sintaxis en JSON
app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        console.error(err);
        return res.status(400).send({ message: "Invalid data" });
    }
    next();
});

// Conexión a base de datos (ajusta según el modelo y la configuración de tu base de datos)
const db = require("./models");
db.sequelize.sync(/* { force: true } */).then(() => {
    console.log("DB resync");
});

// Rutas
require("./routes")(app);

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
