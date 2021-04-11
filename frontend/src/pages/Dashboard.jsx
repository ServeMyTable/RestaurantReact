import React from 'react';
import Navbar from './components/Navbar';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { setMenu } from '../actions/menu';
import { makeStyles } from '@material-ui/core/styles';

import Dishes from './components/Dishes';
import PlaceOrder from './components/PlaceOrder';
import Analytics from './components/Analytics';
import Help from './components/Help';
import TableManagement from './components/TableManagement';
import MyAccount from './components/MyAccount';
import OrderHistory from './components/OrderHistory';
import { useMediaQuery } from 'react-responsive';
import Accounts from './components/Accounts';
import Employees from './components/Employees';
import Feedback from './components/Feedback';
import Tokens from './components/Tokens';

import Subscription from './Subscription';
import { getSubscriptionDetails } from '../actions/subscribe';

const useStyles = makeStyles((theme) => ({
    content : {
      flexGrow:1,
      paddingLeft : theme.spacing(10),
      paddingBottom : theme.spacing(5),
      paddingTop : theme.spacing(4),
      marginLeft: theme.spacing(25),
    },
    contentMobile:{
        flexGrow:1,
        paddingBottom : theme.spacing(5),
        paddingTop : theme.spacing(4),
    },
    '@global': {
        '*::-webkit-scrollbar': {
            width: '0.4em'
        },
        '*::-webkit-scrollbar-track': {
            '-webkit-box-shadow': 'inset 0 0 6px rgba(0,0,0,0.00)'
        },
        '*::-webkit-scrollbar-thumb': {
            backgroundColor: 'rgba(0,0,0,.1)',
        }
      }
}));
const Dashboard = ({menu, subscribe, getSubscriptionDetails}) =>{
    
    const classes = useStyles();
    
    const isTabletOrMobile = useMediaQuery({ query: '(max-width: 1224px)' });
    const isTabletOrMobileDevice = useMediaQuery({query: '(max-device-width: 1224px)'});

    function chooserMenu(){
        switch(menu){
            
            case 'Dashboard':
                return <Analytics/>
            case 'Table Management':
                return <TableManagement/>
            case 'Dishes': 
                return <Dishes/>
            case 'Order History':
                return <OrderHistory/>
            case 'Employees':
                return <Employees/>
            case 'Place Order':
                return <PlaceOrder/>
            case 'My Account':
                return <MyAccount/>
            case 'Help':
                return <Help/>
            case 'Accounts':
                return <Accounts/>
            case 'Feedback':
                return <Feedback/>
            case 'Tokens' : 
                return <Tokens/>
            default:
                return <Analytics/>
        }
    }
    
    setTimeout(()=>{
        getSubscriptionDetails();
    },5000);

    if( subscribe.SubscriptionStatus === "EXPIRED" || 
        subscribe.SubscriptionEndDate <= new Date(new Date().setDate((new Date().getDate()))).getTime()
        ){
        return <Subscription/>
    }
    else{
    return(
        <div>
            <Navbar/>
            { !isTabletOrMobile && !isTabletOrMobileDevice ?
            
            <main className={classes.content}>
                {chooserMenu()}
            </main>
            :
            <main className={classes.contentMobile}>
                {chooserMenu()}
            </main>
            }
        </div>
    );
    }
}

Dashboard.propTypes = {
    menu : PropTypes.string,
    subscribe : PropTypes.object,
    getSubscriptionDetails : PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
    menu: state.menu,
    subscribe : state.subscribe
});

export default connect(mapStateToProps,{ setMenu, getSubscriptionDetails })(Dashboard);