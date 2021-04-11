import React from 'react';
import { 
    Divider, Grid, Box, 
    Button, Tabs, Tab,
    Typography,InputAdornment,
    TextField,SwipeableDrawer,
    } from '@material-ui/core';
import { useTheme } from '@material-ui/core/styles';
import SwipeableViews from 'react-swipeable-views';
import { connect } from 'react-redux';

import AddShoppingCartOutlinedIcon from '@material-ui/icons/AddShoppingCartOutlined';
import SearchIcon from '@material-ui/icons/Search';
import NotInterestedIcon from '@material-ui/icons/NotInterested';

import {loadUser} from '../../actions/auth';
import {placeOrder} from '../../actions/tables';
import PropTypes from 'prop-types';
import { useMediaQuery } from 'react-responsive';
import DishComponent from './DishComponent';
import Alert from './Alerts';

function PlaceOrder({details,loadUser,placeOrder}){

    React.useEffect(()=>{loadUser();},[]);
    const isMobile = useMediaQuery({ query: '(max-width: 768px)' });
    const isMobileDevice = useMediaQuery({query: '(max-device-width: 768px)'});
    const theme = useTheme();
    const [value,setValue] = React.useState(0);
    const [orderCart,setCart] = React.useState([]);
    const [searchDish,setSearch] = React.useState("");

    const [state, setState] = React.useState({bottom: false});
    
    const toggleDrawer = (anchor, open) => (event) => {
        if (event && event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
          return;
        }
    
        setState({ ...state, [anchor]: open });
    };

    function handleSearch(e){ setSearch(e.target.value); }
    function handleChange(event,newValue){setValue(newValue);}
    function a11yProps(index) { return { id: `tabs-${index}`, 'aria-controls': `tabpanel-${index}`}; }  
    function handleChangeIndex(index){  setValue(index); }
    function TabPanel(props){
        const { children, value, index, ...other } = props;

        return (
            <div
            role="tabpanel"
            hidden={value !== index}
            id={`tabpanel-${index}`}
            aria-labelledby={`tabs-${index}`}
            {...other}
            >
            {value === index && (
                <Box p={3}>
                <Typography>{children}</Typography>
                </Box>
            )}
            </div>
        );
    }

    function getUniqueCategories(){
        if(searchDish !== ''){
            const newCategories = [];
            for(var i = 0 ; i< details.Dishes.length ; i++){
                details.Dishes[i].DishName.indexOf(searchDish) > -1 &&
                newCategories.push(details.Dishes[i].Category);
            }
            return newCategories.filter(function(item,pos){return newCategories.indexOf(item) === pos;});
        }
        if(details.Categories !== null && details.Categories !== undefined){
            return details.Categories.filter(function(item, pos){return details.Categories.indexOf(item) === pos;});
        }
    }

    function allTabs(){

        const lst = [];
        if(details !== null && details.Categories !== null){
        const UniqueCategories = getUniqueCategories();
        for(var i=0 ; i < UniqueCategories.length ; i++){
            lst.push(<Tab key={UniqueCategories[i]} label={UniqueCategories[i]} {...a11yProps(i)} />);
        }
        }
        
        return lst;
    }

    function handleAddFunc(order){
        
        if(orderCart.length <= 0){
            setCart([order]);
        }else{
            
            var temp = 0;
            for(var i = 0 ; i < orderCart.length ; i++){
                temp++;
                if(orderCart[i].name === order.name){
                    orderCart[i].units = order.units
                    setCart([...orderCart]);
                    temp=0;
                    break;
                }
            }
            if(temp === orderCart.length){
                setCart([...orderCart,order]);
            }
            
        }
        //console.log(orderCart);
    }

    function support(category){
        
        const lst = [];
        for(var i = 0 ; i< details.Dishes.length ; i++){
            if(details.Dishes[i].Category === category){
                details.Dishes[i].DishName.indexOf(searchDish) > -1 &&
                lst.push(

                    <DishComponent
                        name = {details.Dishes[i].DishName}
                        price = {details.Dishes[i].Price}
                        handleAddFunc = {handleAddFunc}
                        id={i}
                        cart={orderCart}
                    />
                    
                );
            }
        }
        return lst;
    }

    function allPanels(){
        const lst = [];
        if(details !== null && details.Categories !== null){
        const UniqueCategories = getUniqueCategories();
        for(var i=0 ; i < UniqueCategories.length ; i++){
            lst.push(
            <TabPanel 
                value={value} 
                index={i} 
                dir={theme.direction}
                > {support(UniqueCategories[i])}
            </TabPanel>
            );
        }
        }
        return lst;
    }

    function getSubtotal(){
        var SubTotal = 0.0;
        for(var i = 0 ; i < orderCart.length ; i++){
            SubTotal += (orderCart[i].price * orderCart[i].units);
        }
        return SubTotal
    }

    function getTotalCharges(){

        const Charges = details.Taxes;
        if(Charges.length > 0){
            var totalCharges = 0.0;
            const SubTotal = getSubtotal();
            for(var i = 0 ; i< Charges.length ; i++){
                if(Charges[i].TaxType === "Percentage"){
                    totalCharges += (SubTotal * (Number.parseFloat(Charges[i].Amount))/100);
                }
                if(Charges[i].TaxType === "Fixed"){
                    totalCharges += Number.parseFloat(Charges[i].Amount);
                }
            }
            return totalCharges;
        }else{
            return 0.0;
        }
        
    }

    function handleSubmit(e){    
        e.preventDefault();    
        var Dish = [];
        for(var i = 0 ; i < orderCart.length ; i++){
            if(orderCart[i].units !== 0){
                Dish.push({
                    name : orderCart[i].name,
                    units : orderCart[i].units,
                    price : orderCart[i].price,
                });
            }
        }
        
        var CustomerName = e.target[0].value;
        var TableNo = e.target[1].value
        var SubTotal = getSubtotal();
        var TotalBill = SubTotal+getTotalCharges();
        placeOrder({Dish,TableNo,TotalBill,SubTotal,CustomerName});
        setCart([]);
    }
    
    if(details.Dishes.length <= 0){
        return(
            <Box>
            <Grid container>
                <Grid item sm={8} xs={8}>
                    <Box textAlign="left"><h3 className="mFont">Place Order</h3></Box>
                </Grid>
                <Grid item sm={4} xs={4}>
                    <Box textAlign="center">
                        <TextField
                            variant="outlined"
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon/>
                                    </InputAdornment>
                                ),
                                style:{ height:40 }
                            }}
                            placeholder="Search by Dish Name"
                            onChange={handleSearch}
                        />
                    </Box>
                </Grid>
            </Grid>
            {(!isMobile && !isMobileDevice) && <Divider style={{marginTop:10}}/>}
            <Box style={{width:"100%",marginTop:40}}>
                <Typography style={{textAlign:"center"}}><NotInterestedIcon/></Typography>
                <Typography style={{textAlign:"center"}}>No Dishes Added yet.</Typography>
            </Box>
            </Box>
        );
    }
    else
    if(isMobile || isMobileDevice){
        return(
            <Box style={{marginLeft:"10px",marginRight:"10px"}}>
                <Box>
                <Grid container>
                    <Grid item xs={6}>
                        <h3 className="mFont">Place Order</h3> 
                    </Grid>
                    <Grid item xs={6}>
                        <Box textAlign="left">
                            <TextField
                                variant="outlined"
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchIcon/>
                                        </InputAdornment>
                                    ),
                                    style:{ height:40 }
                                }}
                                placeholder="Search by Dish Name"
                                onChange={handleSearch}
                            />
                        </Box>
                    </Grid>
                </Grid>
                <br/>
                <Tabs 
                    value={value} 
                    onChange={handleChange} 
                    aria-label="tabs" 
                    variant="scrollable"
                    scrollButtons="auto"
                    >
                    {allTabs()}
                </Tabs>
                <SwipeableViews
                    axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
                    index={value}
                    onChangeIndex={handleChangeIndex}
                >
                        
                    {allPanels()}
                </SwipeableViews>
                </Box>
                {['bottom'].map((anchor)=>{
                
                return(
                
                <React.Fragment key={anchor}>
                    <button 
                    onClick={toggleDrawer(anchor, true)}
                    className="bottomBtn shadow-lg mFont"
                    >Order Summary</button>
                    <SwipeableDrawer
                        anchor={anchor}
                        open={state[anchor]}
                        onClose={toggleDrawer(anchor, false)}
                        onOpen={toggleDrawer(anchor, true)}
                        style={{
                            borderTopLeftRadius:"60px",
                            borderTopRightRadius:"60px"
                        }}
                    >
                    <Box className="contentOrder">
                        <h5 className="mFont">Order Summary</h5>
                        <Alert/>
                        <br/>
                        {getSubtotal() !== 0 && orderCart.length > 0 ?
                        <div>
                        <Grid container>
                                <Grid item sm={5} xs={5} className="mFont">
                                    Dish Name
                                </Grid>
                                <Grid item sm={2} xs={2} className="mFont">
                                    Qty.
                                </Grid>
                                <Grid item sm={5} xs={5} className="mFont">
                                    Price
                                </Grid>
                            </Grid>
                        <Divider/>
                        <br/>
                        {orderCart.map((order)=>{
                                if(order.units !== 0){
                                return(
                                <Grid container> 
                                    <Grid item sm={5} xs={5} className="mFont">
                                        {order.name}
                                    </Grid>
                                    <Grid item sm={2} xs={2} className="mFont">
                                        x{order.units}
                                    </Grid>
                                    <Grid item sm={5} xs={5} className="mFont">
                                        {order.units * order.price}
                                    </Grid>
                                </Grid>
                                );
                                }
                                else{
                                    return(<div></div>);
                                }
                        })}
                        <Divider/>
                        <Grid container>
                                <Grid item sm={3} xs={3}>

                                </Grid>
                                <Grid item sm={4} xs={4}>
                                    Sub Total
                                </Grid>
                                <Grid item sm={5} xs={5}>
                                    {getSubtotal()}
                                </Grid>
                            </Grid>
                        <Grid container>
                                <Grid item sm={3} xs={3}>

                                </Grid>
                                <Grid item sm={4} xs={4}>
                                    Taxes & Charges
                                </Grid>
                                <Grid item sm={5} xs={5}>
                                    {getTotalCharges()}
                                </Grid>
                            </Grid>
                        <Grid container>
                                <Grid item sm={3} xs={3}>

                                </Grid>
                                <Grid item sm={4} xs={4}>
                                    Total
                                </Grid>
                                <Grid item sm={5} xs={5}>
                                    {getSubtotal()+getTotalCharges()}
                                </Grid>
                            </Grid>
                        <br/>
                        <form onSubmit={(e)=>handleSubmit(e)}>
                                <Grid container spacing={2}>
                                    <Grid item sm={5} xs={5}>
                                        <TextField 
                                        name="CustomerName"
                                        placeholder="Customer Name"    
                                        />
                                    </Grid>
                                    <Grid item sm={5} xs={5}>
                                        <TextField 
                                        name="TableNo"
                                        placeholder="Table No"
                                        required    
                                        />
                                    </Grid>
                                </Grid>
                                <br/>
                                <Button 
                                    variant="contained" 
                                    color="primary" 
                                    startIcon={<AddShoppingCartOutlinedIcon/>}
                                    type="submit"
                                    >
                                    Place Order
                                </Button>
                            </form>
                            
                        </div>

                        : 
                        <Box textAlign="center">
                            <Typography color="textSecondary">
                            No Orders in Cart
                            </Typography>
                        </Box>
                        }
                        
                    </Box>
                    </SwipeableDrawer>
                </React.Fragment>
                );
                }
                )}
            </Box>
        );
    }
    else{
    return(
        <Box>
            <Box>
            <Grid container>
                <Grid item sm={8} xs={8}>
                    <Box textAlign="left"><h3 className="mFont">Place Order</h3></Box>
                </Grid>
                <Grid item sm={4} xs={4}>
                    <Box textAlign="center">
                        <TextField
                            variant="outlined"
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon/>
                                    </InputAdornment>
                                ),
                                style:{ height:40 }
                            }}
                            placeholder="Search by Dish Name"
                            onChange={handleSearch}
                        />
                    </Box>
                </Grid>
            </Grid>
            <Divider style={{marginTop:10}}/>
            <br/>
            <Grid container spacing={1}>
                <Grid item sm={7} xs={7} style={{borderRight:"1px solid #e0e0e0"}}>
                    
                    <Tabs 
                        value={value} 
                        onChange={handleChange} 
                        aria-label="tabs" 
                        variant="scrollable"
                        scrollButtons="auto"
                        >
                        {allTabs()}
                    </Tabs>
                    <SwipeableViews
                        axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
                        index={value}
                        onChangeIndex={handleChangeIndex}
                    >
                        
                    {allPanels()}
                    </SwipeableViews>
                </Grid>
                <Grid item sm={4} xs={4}>
                    <h5 className="mFont">Order Summary</h5>
                    <Alert/>
                    <br/>
                    {getSubtotal() !== 0 && orderCart.length > 0 ?
                    <Box>
                        <Grid container>
                            <Grid item sm={5} xs={5} className="mFont">
                                Dish Name
                            </Grid>
                            <Grid item sm={2} xs={2} className="mFont">
                                Qty.
                            </Grid>
                            <Grid item sm={5} xs={5} className="mFont">
                                Price
                            </Grid>
                        </Grid>
                        <Divider/>
                        <br/>
                        {orderCart.map((order)=>{
                            if(order.units !== 0){
                            return(
                            <Grid container> 
                                <Grid item sm={5} xs={5} className="mFont">
                                    {order.name}
                                </Grid>
                                <Grid item sm={2} xs={2} className="mFont">
                                    x{order.units}
                                </Grid>
                                <Grid item sm={5} xs={5} className="mFont">
                                    {order.units * order.price}
                                </Grid>
                            </Grid>
                            );
                            }
                            else{
                                return(<div></div>);
                            }
                        })}
                        <Divider/>
                        <Grid container>
                            <Grid item sm={3} xs={3}>

                            </Grid>
                            <Grid item sm={4} xs={4}>
                                Sub Total
                            </Grid>
                            <Grid item sm={5} xs={5}>
                                {getSubtotal()}
                            </Grid>
                        </Grid>
                        <Grid container>
                            <Grid item sm={3} xs={3}>

                            </Grid>
                            <Grid item sm={4} xs={4}>
                                Taxes & Charges
                            </Grid>
                            <Grid item sm={5} xs={5}>
                                {getTotalCharges()}
                            </Grid>
                        </Grid>
                        <Grid container>
                            <Grid item sm={3} xs={3}>

                            </Grid>
                            <Grid item sm={4} xs={4}>
                                Total
                            </Grid>
                            <Grid item sm={5} xs={5}>
                                {getSubtotal() + getTotalCharges()}
                            </Grid>
                        </Grid>
                        <br/>
                        <form onSubmit={(e)=>handleSubmit(e)}>
                            <Grid container spacing={2}>
                                <Grid item sm={5} xs={5}>
                                    <TextField 
                                    name="CustomerName"
                                    placeholder="Customer Name"    
                                    />
                                </Grid>
                                <Grid item sm={5} xs={5}>
                                    <TextField 
                                    name="TableNo"
                                    placeholder="Table No"
                                    required    
                                    />
                                </Grid>
                            </Grid>
                            <br/>
                            <Button 
                                variant="contained" 
                                color="primary" 
                                startIcon={<AddShoppingCartOutlinedIcon/>}
                                type="submit"
                                >
                                Place Order
                            </Button>
                        </form>
                        
                    </Box>

                    : 
                    <Box textAlign="center">
                        <Typography color="textSecondary">No Orders in Cart</Typography>
                    </Box>
                    }
                </Grid>
            </Grid>
            </Box>
        </Box>
    );
    }
}

PlaceOrder.propTypes = {
    details : PropTypes.object,
    loadUser : PropTypes.func.isRequired,
    placeOrder : PropTypes.func.isRequired
};

const mapStateToProps = state =>({
    details : state.auth.user
});

export default connect(mapStateToProps,{loadUser,placeOrder})(PlaceOrder);