const db = require("../models");
const { generarTokenUsuario } = require("../utils/code.utils");
const { stringToSha1 } = require("../utils/crypto.utils");
const { checkRequiredFields } = require("../utils/request.utils");

exports.generateUserToken = async (req, res) => {
    const requiredFields = [/* "nombreCompleto","telefono", */ "email", "password"];
    const fieldsWithErrors = checkRequiredFields(requiredFields, req.body);
    if (fieldsWithErrors.length > 0) {
        res.status(400).send({
            message:
                `Faltan los siguientes campos: ${fieldsWithErrors.join(", ")}`
        });
        return;
    }

    const {/*  nombreCompleto,telefono, */ email, password } = req.body;

    const usuario = await db.usuario.findOne({
        where: {
            /* nombreCompleto,
            telefono, */
            email,
            password: stringToSha1(password)
        }
    });
    if (!usuario) {
        res.status(401).send({ message: "Usuario o contraseña incorrectos" });
        return;
    }
    const token = generarTokenUsuario();
    await db.tokens.create({
        token,
        usuario_id: usuario.id
    });
    res.send({ token,esAdmin:usuario.esAdmin,usuario_id: usuario.id  });
}
exports.registerUser = async (req, res) => {
    const requiredFields = ["nombreCompleto","telefono","email", "password"/* ,"esAdmin" */];
    const fieldsWithErrors = checkRequiredFields(requiredFields, req.body);
    if (fieldsWithErrors.length > 0) {
        res.status(400).send({
            message:
                `Faltan los siguientes campos: ${fieldsWithErrors.join(", ")}`
        });
        return;
    }
    const {nombreCompleto,telefono, email, password,esAdmin } = req.body;

    const usuarioDB = await db.usuario.findOne({
        where: {
            email
        }   
    });
    if (usuarioDB) {
        res.status(400).send({
            message: "El email ya está registrado"
        });
        return;

    // Permitir a los administradores crear otros administradores
    /* if (esAdmin && (!res.locals.user || !res.locals.user.esAdmin)) {
        return res.status(403).send({
            message: "Acceso denegado. Solo los administradores pueden crear otros administradores."
        });
    } */
    }
    const usuario = await db.usuario.create({
        nombreCompleto,
        telefono,
        email,
        password: stringToSha1(password),
        esAdmin:esAdmin || false  
        /* esAdmin: esAdmin ? 1 : 0 */  // Si esAdmin está presente y es true, se establece como 1 (administrador), de lo contrario, se establece como 0 (usuario normal)

    });
    usuario.password = undefined;
    res.send(usuario);
}