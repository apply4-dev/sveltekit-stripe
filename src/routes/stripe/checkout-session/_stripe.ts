import Stripe from 'stripe';

const stripe = new Stripe(process.env['STRIPE_SECRET_KEY'], {
	apiVersion: '2022-08-01',
	httpClient: Stripe.createFetchHttpClient()
});

export default stripe;
