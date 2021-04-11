import React from 'react';
import {
    Box, Grid, Typography, IconButton
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';

function DishComponent(props){
    const [counter,setCounter] = React.useState(0);

    function handleIncrement(){ 
        setCounter(counter+1); 
        props.handleAddFunc({
            name:props.name,
            price:props.price,
            units:counter+1,
            type:0,
            id:props.id
        });
    }
    function handleDecrement(){ 

        counter === 0 ? setCounter(0) : setCounter(counter-1)
        props.handleAddFunc({
            name:props.name,
            price:props.price,
            units:counter-1,
            type:0,
            id:props.id
        });
        
    }
    React.useEffect(()=>{
        props.cart.forEach(element => {
            if(element.id === props.id){
                setCounter(element.units);
            }
        });
    },[])

    return(
        <Box>
            <Grid container>
                <Grid item xs={7} sm={7}>
                    <Typography>
                        {props.name}       
                    </Typography>
                    <Typography style={{fontSize:"medium"}} color="textSecondary">
                        Rs. {props.price}
                    </Typography>
                </Grid>
                <Grid item xs={5} sm={5}>
                { counter!==0 
                    ? <IconButton onClick={()=>{handleDecrement();}}><RemoveIcon/></IconButton>
                    : <IconButton><RemoveIcon/></IconButton> 
                }
                        {counter}
                    <IconButton 
                    onClick={()=>{handleIncrement();}}
                    ><AddIcon/></IconButton>
                </Grid>
            </Grid>
            <br/><br/>
        </Box>
    );
}

export default DishComponent;