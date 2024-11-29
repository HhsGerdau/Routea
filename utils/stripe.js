const Stripe = require('stripe');
const stripe = Stripe('sk_test_51QPRCUJ3AtLHQG5bNHjuxc9VAqsW7aH0rbokxfWnZeUK06gEfWg9hRt6MX9m14JJaWegcammZaOeolLIdETaV3CQ00bc9LHZKI'); // Reemplaza con tu clave secreta

module.exports = stripe;