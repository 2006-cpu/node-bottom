import React, { useState, useEffect } from 'react';
import { CartProductCard, Checkout } from '../components';
import { Grid, Image, Text, Box, Button } from '@chakra-ui/react';
import { callApi } from '../api';

//Stripe
import { loadStripe } from '@stripe/stripe-js';
const stripePromise = loadStripe(
	'pk_test_51Hv5dPAJufyTIvrkuzYxDGPBwmCxhlQXMeEv1FRigHCopVezl1re7DJePj5SDz4WljqK6CL14GCStyp1ZnLl2TVm00TOQiWdT0'
);

export const ShoppingCart = ({ token }) => {
	const [cart, setCart] = useState(null);
	const [cartProducts, setCartProducts] = useState([0]);
	const [cartTotal, setCartTotal] = useState(0);
	const [update, setUpdate] = useState(false);
	const [viewCheckout, setViewCheckout] = useState(false);

	const fetchCartData = async () => {
		if (token) {
			const [cartData] = await callApi({
				path: '/orders/cart',
				token: token
			});
			if (cartData) {
				console.log(cartData);
				setCart(cartData);
				setCartProducts(cartData.products);
				setUpdate(false);
			}
		}
	};

	const calculateCartTotal = () => {
		if (cartProducts.length !== 0) {
			let prices = [];
			cartProducts.forEach(product =>
				prices.push(Number(product.price * product.quantity))
			);
			let total = prices.reduce((total, price) => total + price);
			total = Math.round(total * 100) / 100;
			setCartTotal(total);
		} else {
			setCartTotal(0);
		}
	};

	const handleCheckout = async e => {
		e.preventDefault();

		const stripe = await stripePromise;

		const session = await callApi(
			{
				path: '/stripe/create-session',
				method: 'POST',
				token
			},
			{
				total: cartTotal
			}
		);

		const result = await stripe.redirectToCheckout({
			sessionId: session.id
		});

		if (result.error) {
			//render error message
		}

		console.log(session.id);
	};

	useEffect(() => {
		fetchCartData();
	}, [update]);

	useEffect(() => {
		calculateCartTotal();
	}, [cartProducts]);

	return (
		<Grid textAlign='center' marginBottom='20px'>
			<Text>
				{!cart
					? 'Your cart is empty!'
					: `You have ${cartProducts.length} items in your cart!`}
			</Text>
			{!cart
				? null
				: cartProducts.map((product, i) => {
						return (
							<CartProductCard
								product={product}
								key={product.name + i}
								token={token}
								setUpdate={setUpdate}
							/>
						);
				  })}
			{!cart ? null : <Text>Your total is ${cartTotal}</Text>}

			{cartProducts.length === 0 || !token ? null : (
				<Button
					width='300px'
					justifySelf='center'
					onClick={e => handleCheckout(e)}
				>
					Proceed to Checkout
				</Button>
			)}

			{/* {viewCheckout ? <Checkout /> : ''} */}
		</Grid>
	);
};
