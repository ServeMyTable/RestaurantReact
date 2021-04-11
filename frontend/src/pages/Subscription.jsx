import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import { Avatar, Box, Typography, Grid, Chip, Button } from '@material-ui/core';
import Logo from '../assets/logo.png';
import SubscribeImage from '../assets/subscribe.svg';

import { connect } from 'react-redux';

import CustomRadioButton from './elements/CustomRadioButton';
import axios from 'axios';
import { updateSubscription } from '../actions/subscribe';
import LoadingScreen from './elements/LoadingScreen';
import { useMediaQuery } from 'react-responsive';
import { RAZORPAYKEY } from '../config/default.json';

const useStyles = makeStyles((theme)=>({

    Parent : {
        borderLeft:"8px solid #FFD31D",
        paddingLeft:200,
        paddingTop:50,
        height:"100vh"
    },
    Brand : {
        display:"flex",
        flexDirection:"row",
    },
    BrandLogo : {
        padding:10, 
        boxShadow:"3px 3px 72px 11px rgba(0,0,0,0.16)",
        borderRadius:5,
    },
    BrandName : {
        marginLeft:20,
        marginTop:15,
    },
    Information:{
        marginTop:30
    },
    mobParent:{
        borderLeft:"8px solid #FFD31D",
        paddingTop:50,
        height:"100vh",
        paddingLeft:50
    }

}));

function loadScript(src) {
	return new Promise((resolve) => {
		const script = document.createElement('script')
		script.src = src
		script.onload = () => {
			resolve(true)
		}
		script.onerror = () => {
			resolve(false)
		}
		document.body.appendChild(script)
	})
}

function Subscription({user, subscribe, updateSubscription}) {

    const classes = useStyles();
    const [PlanSelected,setSelected] = React.useState({
        Monthly : true,
        Quaterly : false,
    });

    const isTabletOrMobile = useMediaQuery({ query: '(max-width: 1224px)' });
    const isTabletOrMobileDevice = useMediaQuery({query: '(max-device-width: 1224px)'});

    async function handleSubmit()
    {
        const res = await loadScript('https://checkout.razorpay.com/v1/checkout.js');

		if (!res) {
			alert('Razorpay SDK failed to load. Are you online?');
			return;
		}
        var PlanType;
        if(PlanSelected.Monthly){
            PlanType="Monthly";
        }else{
            PlanType="Quaterly";
        }
        
        const data = await axios.post('/api/subscribe/payment/',{PlanType:PlanType});
        
        const options = {
			key: RAZORPAYKEY,
			currency: data.data.currency,
			amount: data.data.amount.toString(),
			order_id: data.data.id,
			name: 'Serve My Table',
			image: { Logo },
			handler: function (response) {

                updateSubscription({
                    payment_id : response.razorpay_payment_id, 
                    order_id : response.razorpay_order_id
                });
			},
			prefill: {
				name: user.username,
				email: user.email,
				contact: user.Phone
			},
            theme:{
                color : "#FFD31D"
            }
		}
		const paymentObject = new window.Razorpay(options)
		paymentObject.open()
    }
    if(user === null){
        return <LoadingScreen/>
    }
    if(isTabletOrMobile || isTabletOrMobileDevice){
        return(
        <Box className={classes.mobParent}>
            <Box className={classes.Brand}>
                <Box className={classes.BrandLogo}>
                    <Avatar src={Logo} style={{width:50,height:'auto'}} variant="rounded"/>    
                </Box>
                <Box className={classes.BrandName}>
                    <Typography variant="h6" component="h3">Serve My Table</Typography>
                </Box>
            </Box>
            <Box className={classes.Information}>
                <Typography variant="h6" component="h6">{subscribe.SubscriptionPlan} PLAN</Typography>
                <Chip color="secondary" label={subscribe.SubscriptionStatus} style={{marginTop:10}}/>
                <Box style={{marginTop:20}}>
                    <Typography style={{marginTop:10}}>{user.username}</Typography>
                    <Typography style={{marginTop:10}}>{user.email}</Typography>
                    <Typography style={{marginTop:10}}>{user.Phone}</Typography>
                </Box>
            </Box>
            <Typography style={{marginTop:10}}>SELECT PLAN</Typography>
            <Box flexDirection="row" display="flex" style={{marginTop:10}}>
                <Box>
                    <CustomRadioButton 
                        PlanName="Monthly" 
                        PlanPrice="1000" 
                        selected={PlanSelected.Monthly}
                        onClick={()=>{setSelected({
                            Monthly:true,
                            Quaterly:false
                        })}}    
                    />
                </Box>
                <Box style={{marginLeft:10}}>
                    <CustomRadioButton 
                        PlanName="Quaterly" 
                        PlanPrice="3000" 
                        selected={PlanSelected.Quaterly}
                        onClick={()=>{setSelected({
                            Monthly:false,
                            Quaterly:true
                        })}}
                    />
                </Box>
            </Box>

            <Button 
            variant="contained" 
            className="mFont" 
            style={{marginTop:20,backgroundColor:"#FFD31D",width:300}} 
            onClick={()=>handleSubmit()}
            disableElevation
            >Subscribe Now</Button>
        </Box>
        );
    }
    return (
        <Box className={classes.Parent}>
            <Grid container>
                <Grid item sm={6} xs={6}>
                    <Box className={classes.Brand}>
                        <Box className={classes.BrandLogo}>
                            <Avatar src={Logo} style={{width:50,height:'auto'}} variant="rounded"/>    
                        </Box>
                        <Box className={classes.BrandName}>
                            <Typography variant="h6" component="h3">Serve My Table</Typography>
                        </Box>
                    </Box>
                    <Box className={classes.Information}>
                        <Typography variant="h6" component="h6">{subscribe.SubscriptionPlan} PLAN</Typography>
                        <Chip color="secondary" label={subscribe.SubscriptionStatus} style={{marginTop:10}}/>
                        <Box style={{marginTop:20}}>
                            <Typography style={{marginTop:10}}>{user.username}</Typography>
                            <Typography style={{marginTop:10}}>{user.email}</Typography>
                            <Typography style={{marginTop:10}}>{user.Phone}</Typography>
                        </Box>
                    </Box>
                    <Typography style={{marginTop:10}}>SELECT PLAN</Typography>
                    <Box flexDirection="row" display="flex" style={{marginTop:10}}>
                        <Box>
                            <CustomRadioButton 
                                PlanName="Monthly" 
                                PlanPrice="1000" 
                                selected={PlanSelected.Monthly}
                                onClick={()=>{setSelected({
                                    Monthly:true,
                                    Quaterly:false
                                })}}    
                            />
                        </Box>
                        <Box style={{marginLeft:10}}>
                            <CustomRadioButton 
                                PlanName="Quaterly" 
                                PlanPrice="3000" 
                                selected={PlanSelected.Quaterly}
                                onClick={()=>{setSelected({
                                    Monthly:false,
                                    Quaterly:true
                                })}}
                            />
                        </Box>
                    </Box>

                    <Button 
                    variant="contained" 
                    className="mFont" 
                    style={{marginTop:20,backgroundColor:"#FFD31D",width:300}} 
                    onClick={()=>handleSubmit()}
                    disableElevation
                    >Subscribe Now</Button>
                </Grid>
                <Grid item sm={6} xs={6}>
                    <Avatar src={SubscribeImage} variant="rounded" style={{width:"30rem",height:"30rem"}}/>
                </Grid>
            </Grid>
        </Box>
    );

}

const mapStateToProps = state =>({
    user : state.auth.user,
    subscribe : state.subscribe
});

export default connect(mapStateToProps,{ updateSubscription })(Subscription);