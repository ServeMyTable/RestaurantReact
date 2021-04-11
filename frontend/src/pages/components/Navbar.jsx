import React from 'react';
import { useMediaQuery } from 'react-responsive'

import { connect } from 'react-redux';
import { logout } from '../../actions/auth';
import { setMenu } from '../../actions/menu';

import PropTypes from 'prop-types';
//import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { 
    AppBar, Toolbar, IconButton, Typography, Badge, Grid,
    Drawer, List, ListItem, ListItemText, SwipeableDrawer, Box,
    ListItemIcon, Divider, Menu, MenuItem, Button, Avatar,  Paper,
    Chip } from '@material-ui/core';

import DehazeIcon from '@material-ui/icons/Dehaze';
import NotificationsNoneIcon from '@material-ui/icons/NotificationsNone';
import AccountCircleOutlinedIcon from '@material-ui/icons/AccountCircleOutlined';
import PersonIcon from '@material-ui/icons/Person';
import ExitToAppRoundedIcon from '@material-ui/icons/ExitToAppRounded';
import DashboardOutlinedIcon from '@material-ui/icons/DashboardOutlined';
import DiscFullOutlinedIcon from '@material-ui/icons/DiscFullOutlined';
import ReceiptOutlinedIcon from '@material-ui/icons/ReceiptOutlined';
import HelpOutlineOutlinedIcon from '@material-ui/icons/HelpOutlineOutlined';
import AddShoppingCartOutlinedIcon from '@material-ui/icons/AddShoppingCartOutlined';
import FilterTiltShiftOutlinedIcon from '@material-ui/icons/FilterTiltShiftOutlined';
import PersonOutlineOutlinedIcon from '@material-ui/icons/PersonOutlineOutlined';
// import ShoppingBasketOutlinedIcon from '@material-ui/icons/ShoppingBasketOutlined';
import PeopleOutlineIcon from '@material-ui/icons/PeopleOutline';
import AccountBalanceWalletOutlinedIcon from '@material-ui/icons/AccountBalanceWalletOutlined';
import FeedbackOutlinedIcon from '@material-ui/icons/FeedbackOutlined';
import DescriptionOutlinedIcon from '@material-ui/icons/DescriptionOutlined';
import DeckIcon from '@material-ui/icons/Deck';
import { getOrders } from '../../actions/tables';
import { getSubscriptionDetails } from '../../actions/subscribe';

import Logo from '../../assets/logo.png';

const useStyles = makeStyles((theme) => ({
    root: {
      flexGrow: 1,
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    mr_20: {
        marginRight: '20px',
    },
    colorBlack : {
        color : '#000'
    },
    appBar:{
        background : '#FFF',
        zIndex: theme.zIndex.drawer + 1,
    },
    navBtn:{
        width : "100%",
        textAlign : "left",
        padding:0,
        textTransform:'none',
        "&:hover":{
            background:'transparent'
        }
    },
    themeColor : {
        color: theme.palette.getContrastText("#ffd31d"),
        backgroundColor: "#ffd31d",
    },
    navHeaderTxt:{
        letterSpacing:2,
        paddingLeft:10,
        paddingTop:10,
        paddingBottom:10,
    },
    DividerNav:{
        marginTop:10,
        marginBottom:10
    }
}));

function Navbar({ logout,setMenu,user,tables,getOrders, getSubscriptionDetails,subscribe,menu }){
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [newanchorEl, setNewAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const Nopen = Boolean(newanchorEl);
    const [state, setState] = React.useState({left: false});
    const handleClose = () => { setAnchorEl(null); };
    const NhandleClose = () => { setNewAnchorEl(null); };
    const handleProfile = ()=>{ setMenu('My Account'); setAnchorEl(null);};
    const handleMenu = (event) => { setAnchorEl(event.currentTarget);};
    const handleNotifications = (event) => { setNewAnchorEl(event.currentTarget); };

    const isTabletOrMobile = useMediaQuery({ query: '(max-width: 1224px)' });
    const isTabletOrMobileDevice = useMediaQuery({query: '(max-device-width: 1224px)'});
    const icons = [
        <DashboardOutlinedIcon/>, //Dashboard
        <FilterTiltShiftOutlinedIcon/>, //Table Management
        <DescriptionOutlinedIcon/>, // Tokens
        <AddShoppingCartOutlinedIcon/>, //Place Order
        <ReceiptOutlinedIcon/>, //Order History
        <AccountBalanceWalletOutlinedIcon/>, //Accounts
        <PeopleOutlineIcon/>, //Employees
        <DiscFullOutlinedIcon/>, //Dishes
        <PersonOutlineOutlinedIcon/>, //My Account
        <FeedbackOutlinedIcon/>,//Feedback
        <HelpOutlineOutlinedIcon/> //Help
    ];
    const texts = [
        'Dashboard',
        'Table Management',
        'Tokens',
        'Place Order',
        'Order History',
        'Accounts',
        'Employees',
        'Dishes',
        'My Account',
        'Feedback',
        'Help'
    ];
    const handleClick = (event)=>{
        const value = event.target.textContent;
        if(value !== ''){
            setMenu(value);
        }
    }


    const toggleDrawer = (anchor, open) => (event) => {
        if (event && event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
          return;
        }
    
        setState({ ...state, [anchor]: open });
    };
    function mobileListItems(){
        const lst = [];
        lst.push(
        <ListItem key={12} >
            <Typography className="navbar-brand logoFont" variant="h6">
                <img src={Logo} width="40" alt="Logo"/> Serve My Table
            </Typography>
        </ListItem>
        );
        lst.push(<Divider/>);
        
        for(var i = 0 ; i < texts.length ; i++){
            lst.push(
                <ListItem className={menu === texts[i] ? "selectedlistItems" : "listItems"} key={texts[i]} onClick={handleClick}>
                    <Button className={classes.navBtn} 
                    variant="text" size="small" id={texts[i]} disableRipple>
                        <ListItemIcon>{icons[i]}</ListItemIcon>
                        <ListItemText>{texts[i]}</ListItemText>
                    </Button>
                </ListItem>
            );
            
            if(i === 6){
                lst.push(
                    <Divider key="divider2" className={classes.DividerNav}/>
                );
                lst.push(
                    <Typography className={classes.navHeaderTxt}>INFORMATION</Typography>
                );
            }
            if(i === 0){
                lst.push(<Divider key="divider0" className={classes.DividerNav}/>)
                lst.push(
                    <Typography className={classes.navHeaderTxt}>ORDERS</Typography>
                );
            }
            if(i === 4){
                lst.push(<Divider key="divider1" className={classes.DividerNav}/>)
                lst.push(
                    <Typography className={classes.navHeaderTxt}>ACCOUNTS & WORKFORCE</Typography>
                );
            }
            if(i === 9){
                lst.push(<Divider key="divider3" className={classes.DividerNav}/>)
                lst.push(
                    <Typography className={classes.navHeaderTxt}>SUPPORT</Typography>
                );
            }
        }
        return(
            <List>
                {lst}
            </List>
            );
    }
    function listItems(){

        
        const lst = [];
        for(var j = 0 ; j < 5 ; j++){
            lst.push(<ListItem key={j}></ListItem>);
        }
        for(var i = 0 ; i < texts.length ; i++){
            lst.push(
                <ListItem className={menu === texts[i] ? "selectedlistItems" : "listItems"} key={texts[i]} onClick={handleClick}>
                    <Button className={classes.navBtn} 
                    variant="text" size="small" id={texts[i]} disableRipple>
                        <ListItemIcon>{icons[i]}</ListItemIcon>
                        <ListItemText>{texts[i]}</ListItemText>
                    </Button>
                </ListItem>
            );
            if(i === 6){
                lst.push(
                    <Divider key="divider2" className={classes.DividerNav}/>
                );
                lst.push(
                    <Typography className={classes.navHeaderTxt}>INFORMATION</Typography>
                );
            }
            if(i === 0){
                lst.push(<Divider key="divider0" className={classes.DividerNav}/>)
                lst.push(
                    <Typography className={classes.navHeaderTxt}>ORDERS</Typography>
                );
            }
            if(i === 4){
                lst.push(<Divider key="divider1" className={classes.DividerNav}/>)
                lst.push(
                    <Typography className={classes.navHeaderTxt}>ACCOUNTS & WORKFORCE</Typography>
                );
            }
            if(i === 9){
                lst.push(<Divider key="divider3" className={classes.DividerNav}/>)
                lst.push(
                    <Typography className={classes.navHeaderTxt}>SUPPORT</Typography>
                );
            }

        }
        return(
            <List>
                {lst}
            </List>
            );
    }
    const classes = useStyles();
    
    setTimeout(()=>{
        getOrders();
        getSubscriptionDetails(); 
    },5000);

    const DateDiff = Math.ceil(Math.abs(subscribe.SubscriptionEndDate - new Date().getTime()) / (1000 * 60 * 60 * 24));

    return(
        <div>
        <AppBar className={classes.appBar} position="relative">
        <Toolbar>
            {isTabletOrMobile || isTabletOrMobileDevice ? 
            <Box>
            {['left'].map((anchor) => {
                return(
                <React.Fragment key={anchor}>
                    <IconButton onClick={toggleDrawer(anchor, true)} edge="start" aria-label="menu" className={classes.colorBlack}>
                        <DehazeIcon/>
                    </IconButton>
                    <SwipeableDrawer
                        anchor={anchor}
                        open={state[anchor]}
                        onClose={toggleDrawer(anchor, false)}
                        onOpen={toggleDrawer(anchor, true)}
                    >
                        <div onClick={toggleDrawer(anchor, false)}>
                            {mobileListItems()}
                        </div>
                    </SwipeableDrawer>
                </React.Fragment>);
            })}
            </Box> 
            : 
            <Box>
            {['left'].map((anchor) => {
                return(
                <React.Fragment key={anchor}>
                    <IconButton onClick={toggleDrawer(anchor, true)} edge="start" aria-label="menu" className={classes.colorBlack}>
                        <DehazeIcon/>
                    </IconButton>
                    <SwipeableDrawer
                        anchor={anchor}
                        open={state[anchor]}
                        onClose={toggleDrawer(anchor, false)}
                        onOpen={toggleDrawer(anchor, true)}
                    >
                        <div onClick={toggleDrawer(anchor, false)}>
                            {listItems()}
                        </div>
                    </SwipeableDrawer>
                </React.Fragment>);
            })}
            </Box>}
            
            <Typography className="navbar-brand logoFont" variant="h6">
                <img src={Logo} width="40" alt="Logo"/> Serve My Table
            </Typography>
            <div className={classes.menuButton}>

            <IconButton 
                className={classes.colorBlack}  
                aria-haspopup="true"
                onClick={handleNotifications}
                aria-controls="notifications-bar"
                >
                <Badge badgeContent={tables.length} color='secondary'>
                <NotificationsNoneIcon/>
                </Badge>
            </IconButton>

            <IconButton className={classes.colorBlack} aria-controls="menu-appbar" aria-haspopup="true"
                onClick={handleMenu}>
                {
                    user === null ? <AccountCircleOutlinedIcon/> :
                    user.ImageUrl ? 
                    <Avatar className={classes.themeColor} src={user.ImageUrl}></Avatar> :
                    <Avatar className={classes.themeColor}>{user.username[0]}</Avatar>
                    
                }
            </IconButton>
            <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                getContentAnchorEl={null}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'center',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'center',
                }}
                open={open}
                onClose={handleClose}
              >
                <MenuItem>
                    <Typography variant="h6" component="h6">{user&&user.username}</Typography>
                </MenuItem>
                <MenuItem style={{marginBottom:0,paddingBottom:0}}>
                    
                    {
                        subscribe&&subscribe.SubscriptionStatus === "FREETRIAL" 
                        ?
                        <Typography className="mFont"> Subscription <Chip size="small" label="FREE TRIAL" style={{backgroundColor:"#FFD31D",fontFamily:"Noto Sans,sans-serif"}}/></Typography>
                        :
                        <Typography className="mFont"> Subscription <Chip size="small" label="ACTIVE" style={{backgroundColor:"#28a745",fontFamily:"Noto Sans,sans-serif",color:'#FFF'}}/></Typography>
                    }
                </MenuItem>
                <MenuItem style={{marginTop:0,paddingTop:0}}>
                    <Typography color="textSecondary">Expires in {DateDiff} days.</Typography>
                </MenuItem>
                <Divider/>
                <MenuItem onClick={handleProfile}> <PersonIcon className={classes.mr_20}/>Profile</MenuItem>
                <MenuItem onClick={logout}> <ExitToAppRoundedIcon className={classes.mr_20}/> Sign Out</MenuItem>
              </Menu>
            
            <Menu
                id="notifications-bar"
                anchorEl={newanchorEl}
                getContentAnchorEl={null}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'center',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'center',
                }}
                open={Nopen}
                onClose={NhandleClose}
            >
                <MenuItem key="headNotification">
                <Typography variant="h6"> Notifications </Typography>
                <Divider/>
                </MenuItem>
                {tables.length > 0 ? 
                tables.map((table)=>
                <MenuItem key={table.tableNo}>
                    <Paper elevation={0}>
                        <Grid container>
                        <Grid item sm={3} xs={3}>
                            <Avatar className={classes.themeColor}><DeckIcon/></Avatar>
                        </Grid>
                        <Grid item sm={9} xs={9}>
                            You have an order<br/> at Table No. {table.tableNo}
                        </Grid>
                        </Grid>
                    </Paper>
                </MenuItem>
                ) : 
                <MenuItem key="NoOrders">
                    <Box textAlign="center">
                        <Typography color="textSecondary">
                        No orders available
                        </Typography>
                    </Box>
                </MenuItem>
                }
            </Menu>
            </div>   
        </Toolbar>
        </AppBar>
        {!isTabletOrMobile && !isTabletOrMobileDevice && 
            <Drawer
                variant="permanent"
                anchor="left"
                >
                {listItems()}
            </Drawer>
        }
        </div>
    );
}

Navbar.propTypes={
    logout: PropTypes.func.isRequired,
    setMenu : PropTypes.func.isRequired,
    user : PropTypes.object,
    tables : PropTypes.array,
    getOrders : PropTypes.func,
    getSubscriptionDetails : PropTypes.func,
    menu : PropTypes.string
}

const mapStateToProps = state =>({
    user : state.auth.user,
    tables : state.tables,
    subscribe : state.subscribe,
    menu : state.menu
});

export default connect(mapStateToProps,{ logout,setMenu,getOrders,getSubscriptionDetails })(Navbar);