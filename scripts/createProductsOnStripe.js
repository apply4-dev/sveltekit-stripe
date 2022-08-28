import Stripe from 'stripe';
import fs from 'fs';
import path from 'path';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
	apiVersion: '2020-08-27'
});

const plans = [
	{
		product: {
			name: 'Standard Plan',
			description: 'Best cost-benefit ever.'
		},
		price: {
			currency: 'usd',
			unit_amount: 500,
			recurring: {
				interval: 'month'
			}
		},
		includes: ['100 job applications/month', 'Support via email/discord']
	}
];

async function main() {
	await Promise.all(
		plans.map(async (plan) => {
			// Only create the product if it's not free
			if (plan.price.unit_amount > 0) {
				const product = await stripe.products.create(plan.product);
				const price = await stripe.prices.create({
					...plan.price,
					product: product.id
				});
				console.log(`${plan.product.name} id: ${product.id}`);
				plan.product.id = product.id;
				plan.price.id = price.id;
			}
		})
	);
	fs.writeFileSync(
		path.join(path.resolve(path.dirname('')), './src/routes/plansData.json'),
		JSON.stringify(plans, null, 2),
		'utf8'
	);
	console.log('Products created');
}

main()
	.then(() => {
		process.exit(0);
	})
	.catch((err) => {
		console.error(err);
		process.exit(1);
	});
