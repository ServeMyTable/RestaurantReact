import React from 'react';

import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import { loadUser } from '../../actions/auth';
import { getOrders } from '../../actions/history';
import { getAccounts } from '../../actions/accounts';
import { useMediaQuery } from 'react-responsive';

import { Line } from 'react-chartjs-2';
import { Divider, Box, Typography, Grid } from '@material-ui/core';

import Rating from '@material-ui/lab/Rating';

import { makeStyles } from '@material-ui/core/styles';

import CopyrightIcon from '@material-ui/icons/Copyright';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import AddIcon from '@material-ui/icons/Add';
import TrendingUpIcon from '@material-ui/icons/TrendingUp';
import AccountBalanceWalletIcon from '@material-ui/icons/AccountBalanceWallet';
import TrendingDownIcon from '@material-ui/icons/TrendingDown';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';

import Axios from 'axios';

const useStyles = makeStyles((theme)=>({
    shadowBox :{
        padding:10,
        marginTop:10,
        boxShadow:"0px 3px 6px rgba(0,0,0,0.16)"
    },
    customCard:{
        border: 0,
        borderRadius: 3,
        color: 'white',
        display:"flex",
        padding:20,
        flexDirection:"row",
        justifyContent:"space-between"
    },
    cardRed:{
        background:"linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)",
        boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
    },
    cardBlue:{
        background:'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
        boxShadow:'0 3px 5px 2px rgba(33, 203, 243, .3)',
    },
    cardYellow:{
        background:'linear-gradient(45deg, #ffb347 30%, #ffcc33 90%)',
        boxShadow:'0 3px 5px 2px rgba(255,204,51, .3)',
    },
    cardGreen:{
        background:'linear-gradient(45deg,#11998e 30%,#38ef7d 90%)',
        boxShadow:'0 3px 5px 2px rgba(56,239,125, .3)',
    },
    Ratings:{
        fontSize:100,
        textAlign:'center',
        marginTop:30
    },
    RatingsMob:{
        fontSize:100,
        textAlign:'center',
        marginTop:20,
    }
}));

function Analytics({loadUser,getAccounts, getOrders, history, accounts}){

    const classes = useStyles(); 

    const isMobile = useMediaQuery({ query: '(max-width: 768px)' });
    const isMobileDevice = useMediaQuery({query: '(max-device-width: 768px)'});

    const allDates = [];
    const finalData = [];
    const finalLabels = [];
    
    const [feedbacks,setFeedbacks] = React.useState([]);

    const getCount = (date) =>{
        var cnt = 0;
        for(var i = 0 ; i < allDates.length; i++){
            if(allDates[i] === date){
                cnt=cnt+1;
            }
        }
        return cnt;
    }
    const getEarnings = (date) =>{
        var counter = 0.0;
        for(var i = 0 ; i < history.length ; i++){
            if(history[i] !== undefined && history[i].CompletedDateOrder === date){
                counter += Number.parseFloat(history[i].TotalBill);
            }
        }
        for(var k=0 ; k<accounts.length ; k++){
            if( accounts[k] !== undefined && accounts[k].AmountType === true && accounts[k].Date === date){
                counter += parseFloat(accounts[k].Credit);
            }
        }
        return counter;
    };
    const getDebits = (date) =>{

        var totalDebits = 0.0;
        for(var k=0 ; k<accounts.length ; k++){
            if( accounts[k] !== undefined && accounts[k].AmountType === false && accounts[k].Date === date){
                totalDebits += parseFloat(accounts[k].Debit);
            }
        }
        return totalDebits;
    };
    const getAvgStars = () =>{

        let num = 0;
        for(var i = 0 ; i<feedbacks.length ; i++){
            num += Number.parseInt(feedbacks[i].stars);
        }
        if(feedbacks.length<1){
            return num;
        }else{
            return (num/feedbacks.length).toFixed(1) ;
        }
    };

    React.useEffect(()=>{
        setTimeout(()=>{
            loadUser();
            getOrders();
            getAccounts();
            Axios.get("/api/feedback")
            .then(response=>{
                setFeedbacks(response.data);
            }).catch(err=>console.error(err));
        },5000);
    },[]);

    for(var m=0; m<history.length; m++){
        allDates.push(history[m].CompletedDateOrder);
    }

    const uniqueDates = allDates.filter((item, i, ar) => ar.indexOf(item) === i);

    for(var i=0 ; i<uniqueDates.length ; i++){
        finalData.push(getCount(uniqueDates[i]))
        finalLabels.push(uniqueDates[i]);
    }

    const Today = (new Date(Date.now()).toLocaleString().split(','))[0].toString();

    const LineOptions = {
        responsive:true,
        scales:{
            xAxes:[{
                stacked:true,
            }],
            yAxes:[{
                stacked:true
            }]
        },
        legend:{
            display:false,
        },
        animation:{
            duration:2000,
            easing:"linear",
        }
    };
    const LineData = {
        labels : finalLabels,
        datasets:[{
            label:"Sales",
            backgroundColor: "#ffcc3350",
            borderColor: "#FFD31D",
            borderWidth: 5,
            data : finalData
        }]
    };

    if(isMobile || isMobileDevice){
        return(
        <Box>
            <Box style={{marginLeft : "10px",marginRight:"10px"}}>
                <h3 className="mFont"> Dashboard </h3>

                <Grid container style={{marginTop:10}} spacing={1}>

                    <Grid item xs={6} sm={6}>
                        <Box className={[classes.customCard,classes.cardRed]}>
                            <Box style={{verticalAlign:'middle'}}>
                                <ShoppingCartIcon style={{fontSize:50}}/>
                            </Box>
                            <Box>
                                <Typography variant="h6">Todays Orders</Typography>
                                <Typography><AddIcon/> {getCount(Today)}</Typography>
                            </Box>
                        </Box>
                    </Grid>

                    <Grid item xs={6} sm={6}>
                        <Box className={[classes.customCard,classes.cardBlue]}>
                            <Box style={{verticalAlign:'middle'}}>
                                <AccountBalanceWalletIcon style={{fontSize:50}}/>
                            </Box>
                            <Box>
                                <Typography variant="h6">Todays Earn..</Typography>
                                <Typography><TrendingUpIcon/> {getEarnings(Today)}</Typography>
                            </Box>
                        </Box>
                    </Grid>

                    <Grid item xs={6} sm={6}>
                        <Box className={[classes.customCard,classes.cardGreen]}>
                            <Box style={{verticalAlign:'middle'}}>
                                <AccountBalanceWalletIcon style={{fontSize:50}}/>
                            </Box>
                            <Box>
                                <Typography variant="h6">Todays Debit</Typography>
                                <Typography><TrendingDownIcon/> {getDebits(Today)}</Typography>
                            </Box>
                        </Box>
                    </Grid>

                    <Grid item xs={6} sm={6}>
                        <Box className={[classes.customCard,classes.cardYellow]}>
                            <Box style={{verticalAlign:'middle'}}>
                                <ShoppingCartIcon style={{fontSize:50}}/>
                            </Box>
                            <Box>
                                <Typography variant="h6">Total Orders</Typography>
                                <Typography><ArrowUpwardIcon/> {history.length}</Typography>
                            </Box>
                        </Box>
                    </Grid>

                </Grid>
                <Box style={{marginTop:2}}>
                    <Box className={classes.shadowBox}>
                    
                        <Box style={{padding:10}}>
                            <Typography variant="h6" component="h6" 
                            style={{letterSpacing:2}}>PERFORMANCE GRAPH</Typography>
                        </Box>
                        <Box style={{overflow:"scroll"}}>
                            <Line 
                            width={10}
                            height={5}
                            style={{margin:0}}
                            data={LineData} options={LineOptions}
                            />  
                        </Box>
                    
                    </Box>
                    <Box className={classes.shadowBox}>
                       
                        <Box style={{padding:10}}>
                            <Typography variant="h6" component="h6" 
                            style={{letterSpacing:2}}>RATINGS</Typography>
                        </Box>
                        <Box textAlign="center" style={{paddingBottom:20}}>    
                            <Typography className={classes.RatingsMob}>{getAvgStars()}</Typography>
                            <Rating precision={0.5} value={getAvgStars()} readOnly />
                        </Box>
                    </Box>
                </Box>

                <Box textAlign="center" style={{color:"gray",paddingTop:15}}>
                    <Typography>Copyrights <CopyrightIcon/> Reserved by Serve My Table</Typography>
                </Box>
            </Box>
        </Box>
        )
    }else{
    return(
        <Box>
            <Box>
                <h3 className="mFont"> Dashboard </h3>
                <Divider style={{marginTop:10}}/>

                <Grid container style={{marginTop:10}} spacing={1}>
                    <Grid item xs={3} sm={3}>
                        <Box className={[classes.customCard,classes.cardRed]}>
                            <Box style={{verticalAlign:'middle'}}>
                                <ShoppingCartIcon style={{fontSize:50}}/>
                            </Box>
                            <Box>
                                <Typography variant="h6">Todays Orders</Typography>
                                <Typography><AddIcon/> {getCount(Today)}</Typography>
                            </Box>
                        </Box>
                    </Grid>
                    <Grid item xs={3} sm={3}>
                        <Box className={[classes.customCard,classes.cardBlue]}>
                            <Box style={{verticalAlign:'middle'}}>
                                <AccountBalanceWalletIcon style={{fontSize:50}}/>
                            </Box>
                            <Box>
                                <Typography variant="h6">Todays Earnings</Typography>
                                <Typography><TrendingUpIcon/> {getEarnings(Today)}</Typography>
                            </Box>
                        </Box>
                    </Grid>

                    <Grid item xs={3} sm={3}>
                        <Box className={[classes.customCard,classes.cardGreen]}>
                            <Box style={{verticalAlign:'middle'}}>
                                <AccountBalanceWalletIcon style={{fontSize:50}}/>
                            </Box>
                            <Box>
                                <Typography variant="h6">Todays Debit</Typography>
                                <Typography><TrendingDownIcon/> {getDebits(Today)}</Typography>
                            </Box>
                        </Box>
                    </Grid>

                    <Grid item xs={3} sm={3}>
                        <Box className={[classes.customCard,classes.cardYellow]}>
                            <Box style={{verticalAlign:'middle'}}>
                                <ShoppingCartIcon style={{fontSize:50}}/>
                            </Box>
                            <Box>
                                <Typography variant="h6">Total Orders</Typography>
                                <Typography><ArrowUpwardIcon/> {history.length}</Typography>
                            </Box>
                        </Box>
                    </Grid>
                    
                </Grid>

                <Box style={{marginTop:2,display:"flex",flexDirection:"row"}}>
                    <Box className={classes.shadowBox} style={{width:"70%"}}>
                    
                        <Box style={{padding:10}}>
                            <Typography variant="h6" component="h6" 
                            style={{letterSpacing:2}}>PERFORMANCE GRAPH</Typography>
                        </Box>
                        <Box style={{overflow:"scroll"}}>
                            <Line 
                            width={10}
                            height={5}
                            style={{margin:0}}
                            data={LineData} options={LineOptions}
                            />  
                        </Box>
                    
                    </Box>
                    <Box style={{marginLeft:10,width:"30%"}} className={classes.shadowBox}>
                       
                        <Box style={{padding:10}}>
                            <Typography variant="h6" component="h6" 
                            style={{letterSpacing:2}}>RATINGS</Typography>
                        </Box>
                        <Box textAlign="center">    
                            <Typography className={classes.Ratings}>{getAvgStars()}</Typography>
                            <Rating precision={0.5} value={getAvgStars()} readOnly />
                        </Box>
                    </Box>
                </Box>

                
            </Box>
            <Box textAlign="center" style={{color:"gray",paddingTop:15}}>
                <Typography>Copyrights <CopyrightIcon/> Reserved by Serve My Table</Typography>
            </Box>
        </Box>
    );
    }
}
Analytics.propTypes = {
    loadUser : PropTypes.func.isRequired,
    getOrders : PropTypes.func.isRequired,
    getAccounts : PropTypes.func.isRequired,
    history : PropTypes.array,
    accounts : PropTypes.array,
}
const mapStateToProps = state => ({
    history : state.history,
    accounts : state.accounts,
});


export default connect(mapStateToProps,{loadUser,getOrders, getAccounts})(Analytics);