import React from 'react';
import { Grid, Text, Box, Image } from '@chakra-ui/react';
import './productpreviewcard.css'

export const MyOrders = ({orders, currentUser}) => {
    console.log(orders)
    
	return (
		<Box textAlign="center" className='myorders'>myOrders 
		<Grid templateColumns="repeat(3, 1fr)" margin='25px' className='orders'
				justifyItems='center'
				boxShadow='xs'
				rounded='md'
                >
                {orders.map(({id, status, userId, datePlaced, products}) =>
                
				
        		<Box key={id} className="Orders" border="5px groove white" className='products'>
                <Text fontSize='xl'><b>Order By:  {currentUser.username} </b></Text>
          		<Text>Order Status:  {status} </Text>
            	<Text>Order Date: {datePlaced }</Text>
                <Text>Items: {products && products.map(({id ,name, description, price, imageurl, inStock, category  }) =>
                
                <Box key={id} className="Products">
                <Text> Product Name: {name} </Text>
                <Text> Details: {description} </Text>
                <Text> Price: {price} </Text>
                <Image src={imageurl ? imageurl : ""}/>
                <Text> Availability: {inStock ? 'In Stock' : 'Out of Stock'} </Text>
                <Text> Category: {category} </Text>
				</Box>
				
                )}</Text>
                </Box>
                
                )}
		</Grid>
		</Box>
	)
};