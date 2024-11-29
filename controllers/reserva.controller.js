const db = require("../models");
const paypal = require("@paypal/checkout-server-sdk");

const environment = new paypal.core.SandboxEnvironment("ATDeKbFt05XQDPZOl1Qcj-C6jXmYRNGba00WjTEtB7_quzeY1X9aYpsz8RFQHIzs7DDyYbk-gnuBFmtq", "EOpM6iCe06cftRwpO0hZsxpmPYKSOzoa8sl_qwgh9gng_ie_RQeG3BDONLdxpCsoggWs9z1SaAOif0ml");
const client = new paypal.core.PayPalHttpClient(environment);


exports.createReserva = async (req, res) => {
    const { usuarioId, propiedadId, fechaInicio, fechaFin /* cantidadAdultos, cantidadNiños */ } = req.body;

    try {
        // Verificar si la propiedad existe
        const propiedad = await db.propiedad.findByPk(propiedadId);
        if (!propiedad) {
            return res.status(404).json({ message: "La propiedad no existe" });
        }

        // Calcular la cantidad de noches
        const fechaInicioObj = new Date(fechaInicio);
        const fechaFinObj = new Date(fechaFin);
        const cantidadNoches = Math.ceil(
            (fechaFinObj - fechaInicioObj) / (1000 * 60 * 60 * 24)
        );

        if (cantidadNoches <= 0) {
            return res.status(400).json({ message: "La fecha de fin debe ser posterior a la de inicio" });
        }

        // Calcular el monto total
        const montoTotal = cantidadNoches * parseFloat(propiedad.precioPorNoche);

        // Crear la reserva en estado "pendiente"
        const reserva = await db.reserva.create({
            usuarioId,
            propiedadId,
            fechaInicio,
            fechaFin,
           /*  cantidadAdultos,
            cantidadNiños, */
            montoTotal,
        });

        // Crear la orden de PayPal
        const request = new paypal.orders.OrdersCreateRequest();
        request.prefer("return=representation");
        request.requestBody({
            intent: "CAPTURE",
            purchase_units: [
                {
                    amount: {
                        currency_code: "USD",
                        value: montoTotal.toFixed(2),
                    },
                    description: `Reserva para la propiedad: ${propiedad.nombre}`,
                },
            ],
            application_context: {
                return_url: `http://localhost:3001/reservas/${reserva.id}/success`,
                cancel_url: `http://localhost:3001/reservas/${reserva.id}/cancel`,
            },
        });

        const order = await client.execute(request);

        // Devolver el enlace para el cliente
        res.json({
            id: reserva.id,
            orderID: order.result.id,
            approveLink: order.result.links.find((link) => link.rel === "approve").href,
        });
    } catch (error) {
        res.status(500).json({ message: "Error al crear la reserva", error: error.message });
    }
};



exports.confirmReserva = async (req, res) => {
    const { orderId, reservaId } = req.body;

    try {
        const request = new paypal.orders.OrdersCaptureRequest(orderId);
        request.requestBody({});
        const capture = await client.execute(request);

        // Actualizar el estado de la reserva
        await db.reserva.update(
            { estado: "pagado" },
            { where: { id: reservaId } }
        );

        res.json({ message: "Reserva confirmada con éxito", capture });
    } catch (error) {
        res.status(500).json({ message: "Error al confirmar la reserva", error: error.message });
    }
};
