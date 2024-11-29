const db = require("../models");
const paypal = require("@paypal/checkout-server-sdk");

const environment = new paypal.core.SandboxEnvironment("ATDeKbFt05XQDPZOl1Qcj-C6jXmYRNGba00WjTEtB7_quzeY1X9aYpsz8RFQHIzs7DDyYbk-gnuBFmtq", "EOpM6iCe06cftRwpO0hZsxpmPYKSOzoa8sl_qwgh9gng_ie_RQeG3BDONLdxpCsoggWs9z1SaAOif0ml");
const client = new paypal.core.PayPalHttpClient(environment);

// Crear una reserva de paquete turístico
exports.createReservaPaquete = async (req, res) => {
    const { usuarioId, paqueteTuristicoId, fechaInicio, fechaFin } = req.body;

    try {
        // Verificar si el paquete turístico existe
        const paquete = await db.paqueteturistico.findByPk(paqueteTuristicoId);
        if (!paquete) {
            return res.status(404).json({ message: "El paquete turístico no existe" });
        }

        // Calcular el monto total (puedes cambiarlo según tu lógica)
        const montoTotal = paquete.precio * (new Date(fechaFin) - new Date(fechaInicio)) / (1000 * 3600 * 24);

        // Crear la reserva
        const reserva = await db.reserva.create({
            usuarioId,
            paqueteTuristicoId,
            fechaInicio,
            fechaFin,
            montoTotal
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
                    description: `Reserva para el paquete turístico: ${paquete.nombre}`,
                },
            ],
            application_context: {
                return_url: `http://localhost:3001/reservas/${reserva.id}/success`,
                cancel_url: `http://localhost:3001/reservas/${reserva.id}/cancel`,
            },
        });

        const order = await client.execute(request);

        res.json({
            id: reserva.id,
            orderID: order.result.id,
            approveLink: order.result.links.find((link) => link.rel === "approve").href,
        });
    } catch (error) {
        res.status(500).json({ message: "Error al crear la reserva del paquete turístico", error: error.message });
    }
};


// Confirmar la reserva de paquete turístico
exports.confirmReservaPaquete = async (req, res) => {
    const { orderId, reservaPaqueteId } = req.body;

    try {
        const request = new paypal.orders.OrdersCaptureRequest(orderId);
        request.requestBody({});
        const capture = await client.execute(request);

        // Actualizar el estado de la reserva
        await db.paqueteturistico.update(
            { estado: "pagado" },
            { where: { id: reservaPaqueteId } }
        );

        res.json({ message: "Reserva confirmada con éxito", capture });
    } catch (error) {
        res.status(500).json({ message: "Error al confirmar la reserva del paquete turístico", error: error.message });
    }
};
