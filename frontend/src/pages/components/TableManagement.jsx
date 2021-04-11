import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import { getOrders,OrderCancel,OrderComplete } from '../../actions/tables';

import {    Divider, Box, Grid, TextField, 
            InputAdornment, Card, CardContent,
            CardActions,    
            Typography,
            Button} from '@material-ui/core';

import { useMediaQuery } from 'react-responsive';
import RestaurantMenuIcon from '@material-ui/icons/RestaurantMenu';
import SearchIcon from '@material-ui/icons/Search';

function TableManagement({tables,getOrders,OrderCancel,OrderComplete}){

    const [searchTable, setSearch] = React.useState('');
    const isMobile = useMediaQuery({ query: '(max-width: 768px)' });
    const isMobileDevice = useMediaQuery({query: '(max-device-width: 768px)'});

    function handleSearch(e){ setSearch(e.target.value); }

    function handleCancel(TableNo,RestaurantID,OrderId){
        OrderCancel({
            TableNo : TableNo,
            RestaurantId : RestaurantID,
            OrderId : OrderId
        });
    }

    function handleComplete(TableNo,RestaurantID,OrderId){
        OrderComplete({
            TableNo : TableNo,
            RestaurantId : RestaurantID,
            OrderId : OrderId
        });
    }

    function mobileAllTables(){
        const lst = [];
        tables.map((table)=>(
            (table.tableNo + "").indexOf(searchTable) > -1 &&
            lst.push(
                <Box>
                <Box 
                    style={ table.OrderType === 'Local' ? {
                        backgroundColor:'#28a745',
                        border:'1px solid #28a745',
                        borderTopLeftRadius : 10,
                        borderTopRightRadius : 10,
                        color:'#FFF'
                    } : {
                        backgroundColor:'#d63447',
                        border:'1px solid #d63447',
                        borderTopLeftRadius : 10,
                        borderTopRightRadius : 10,
                        color:'#FFF'
                    }}
                >
                    <Typography style={{textAlign:'center'}}>
                    {table.OrderType}
                    </Typography>
                </Box>
                <Card variant="outlined">
                    <CardContent>
                        
                        <Typography variant="h5">
                            Table No. {table.tableNo}
                        </Typography>
                            
                        <Typography variant="body2" color="textSecondary">
                            {table.CustomerName}<br/>
                            {table.notes}
                        </Typography>

                        <Typography>
                            {table.Orders.map((order)=>(
                            <Grid container>
                                <Grid item sm={8} xs={8}>
                                    {order.DishName}
                                </Grid>
                                <Grid item sm={4} xs={4}>
                                    {order.Quantity} 
                                </Grid> 
                            </Grid>
                            ))}
                        </Typography>
                    </CardContent>          
                    <CardActions>
                        <Button 
                            variant="outlined" 
                            color="secondary" 
                            onClick={()=>{handleCancel(table.tableNo,table.RestaurantID,table.OrderId)}}
                            >
                            Cancel Order
                        </Button>
                        <Button 
                            variant="contained" 
                            color="primary" 
                            disableElevation
                            onClick={()=>{handleComplete(table.tableNo,table.RestaurantID,table.OrderId)}}
                            >
                            Order Completed
                        </Button>
                    </CardActions>
                </Card>
                {table.OrderType === 'Delivery' &&
                <Box 
                    style={{
                        border:'1px solid #28a745',
                        borderTopLeftRadius : 10,
                        borderTopRightRadius : 10,
                        color:'#FFF',
                        padding:10
                    }}>
                    <Typography>Delivery Address</Typography>
                    <Typography style={{marginTop:10}}>{table.CustomerAddress}</Typography>
                </Box>
                }
                </Box>
            )));

        return lst;
    }

    function allTables(){
        const lst = [];

        tables.map((table)=>(
            (table.tableNo + "").indexOf(searchTable) > -1 &&
            lst.push(
            <Grid item>
                <Box 
                    style={ table.OrderType === 'Local' ? {
                        backgroundColor:'#28a745',
                        border:'1px solid #28a745',
                        borderTopLeftRadius : 10,
                        borderTopRightRadius : 10,
                        color:'#FFF'
                    } : {
                        backgroundColor:'#d63447',
                        border:'1px solid #d63447',
                        borderTopLeftRadius : 10,
                        borderTopRightRadius : 10,
                        color:'#FFF'
                    }}
                >
                    <Typography style={{textAlign:'center'}}>
                    {table.OrderType}
                    </Typography>
                </Box>
                <Card variant="outlined">
                    <CardContent>
                        
                        <Typography variant="h5">
                            Table No. {table.tableNo}
                        </Typography>
                            
                        <Typography variant="body2" color="textSecondary">
                            {table.CustomerName}<br/>
                            {table.notes}
                        </Typography>

                        <Typography>
                            {table.Orders.map((order)=>(
                            <Grid container>
                                <Grid item sm={8} xs={8}>
                                    {order.DishName}
                                </Grid>
                                <Grid item sm={4} xs={4}>
                                    {order.Quantity} 
                                </Grid> 
                            </Grid>
                            ))}
                        </Typography>
                    </CardContent>          
                    <CardActions>
                        <Button 
                            variant="outlined" 
                            color="secondary" 
                            onClick={()=>{handleCancel(table.tableNo,table.RestaurantID,table.OrderId)}}
                            >
                            Cancel Order
                        </Button>
                        <Button 
                            variant="contained" 
                            color="primary" 
                            disableElevation
                            onClick={()=>{handleComplete(table.tableNo,table.RestaurantID,table.OrderId)}}
                            >
                            Order Completed
                        </Button>
                    </CardActions>
                </Card>
                {table.OrderType === 'Delivery' &&
                <Box 
                    style={{
                        border:'1px solid #28a745',
                        borderTopLeftRadius : 10,
                        borderTopRightRadius : 10,
                        color:'#FFF',
                        padding:10
                    }}>
                    <Typography>Delivery Address</Typography>
                    <Typography style={{marginTop:10}}>{table.CustomerAddress}</Typography>
                </Box>
                }
            </Grid>
        )));
        return lst;
    }
    
    setTimeout(()=>{
        getOrders();
    },5000);
    
    return(
        <div>
        
        {isMobile || isMobileDevice ? 
        
        <Box style={{marginLeft:"10px",marginRight:"10px"}}>
            
            <h3 className="mFont">Table Management</h3>    
            <Box>
                    
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
                    placeholder="Search by Table No"
                    onChange={handleSearch}
                    fullWidth
                />
                    
            </Box>
        
            <br/>
            <Box>
                {   tables.length > 0 ?
                    mobileAllTables()
                    :
                    <Box style={{width:"100%"}}>
                        <Typography style={{textAlign:"center"}}><RestaurantMenuIcon/></Typography>
                        <Typography style={{textAlign:"center"}}>No Orders Placed yet</Typography>
                    </Box>
                }
            </Box>
        </Box>
        
        :
        
        <Box>
            <Grid container>
                <Grid item sm={8} xs={8}>
                    <Box textAlign="left"><h3 className="mFont">Table Management</h3></Box>
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
                            placeholder="Search by Table No"
                            onChange={handleSearch}
                        />
                    </Box>
                </Grid>
            </Grid>
            <Divider style={{marginTop:10}}/>
            <br/><br/>
            <Grid container>
                
                {   tables.length > 0 ?
                    allTables()
                    :
                    <Box style={{width:"100%"}}>
                        <Typography style={{textAlign:"center"}}><RestaurantMenuIcon/></Typography>
                        <Typography style={{textAlign:"center"}}>No Orders Placed yet</Typography>
                    </Box>
                }
            </Grid>
            
            </Box>
            }
        </div>
    );
}

TableManagement.propTypes = {
    tables : PropTypes.array.isRequired,
    getOrders : PropTypes.func.isRequired,
    OrderCancel : PropTypes.func.isRequired,
    OrderComplete : PropTypes.func.isRequired
};

const mapStateToProps = state =>({
    tables : state.tables
});

export default connect(mapStateToProps,{getOrders,OrderCancel,OrderComplete})(TableManagement);