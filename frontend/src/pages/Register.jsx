import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { setAlert } from '../actions/alert';
import { setLoading } from '../actions/loading';
import { register } from '../actions/auth';
import Alerts from './components/Alerts';
import Logo from '../assets/logo.png';
import { useMediaQuery } from 'react-responsive';
import { 
    TextField, InputAdornment, IconButton, 
    AppBar, Toolbar, Typography, Divider, 
    Box
} from '@material-ui/core';
import { withStyles,makeStyles} from '@material-ui/core/styles';
import PersonOutlineOutlinedIcon from '@material-ui/icons/PersonOutlineOutlined';
import MailOutlineRoundedIcon from '@material-ui/icons/MailOutlineRounded';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import PhoneOutlinedIcon from '@material-ui/icons/PhoneOutlined';
import CustomRadioButton from './elements/CustomRadioButton';
import LoadingScreen from './elements/LoadingScreen';

const CustomTextField = withStyles({
    root : {
        '& label.Mui-focused': {
            color: '#FFD31D',
        },
        '& .MuiInput-underline:after': {
            borderBottomColor: '#FFD31D',
        },
        '& .MuiOutlinedInput-root': {
            '& fieldset': {
        },
        '&:hover fieldset': {
          borderColor: '#FFD31D',
        },
        '&.Mui-focused fieldset': {
          borderColor: '#FFD31D',
          
        },
        }
    }
})(TextField);
const useStyles = makeStyles((theme)=>({

    LoginInput : {
        width:'30%',
        marginTop:'20px',
        padding:'10px',
        fontSize:'larger'
    },
    mobileLoginInput : {
        width : '100%',
        marginTop:'20px',
        padding:'10px',
        fontSize:'larger'
    }

}));

function Register({ setAlert,setLoading,register,isAuthenticated,loading }){
    
    const classes = useStyles();

    const [formData , setFormData] = React.useState({
        username : '',
        email : '',
        password : '',
        confirmPassword : '',
        Phone : null,
        Plan : 'Monthly',
    });
    
    const isMobile = useMediaQuery({ query: '(max-width: 768px)' });
    const isMobileDevice = useMediaQuery({query: '(max-device-width: 768px)'});

    const [PlanSelected,setSelected] = React.useState({
        Monthly : true,
        Quaterly : false,
    });

    const { username, email, password, confirmPassword, Phone, Plan } = formData;

    const onChange = e => setFormData({ ...formData, [e.target.name] : e.target.value });

    const onSubmit = e =>{
        e.preventDefault();
        if(username === ''){
            setAlert('Please fill the username field.','error');
        }else
        if(email === ''){
            setAlert('Please fill the email field.','error');
        }else
        if(Phone === null){
            setAlert('Please fill the phone field.','error');
        }else
        if(password === ''){
            setAlert('Please fill the password field.','error');
        }else
        if(confirmPassword === ''){
            setAlert('Please fill the confirm password field.','error');
        }else
        if(password === confirmPassword){
            register({ username, email, password, Phone, Plan });
            setLoading();
        }else{
            setAlert('Password do not match','error');
        }
    }

    if(isAuthenticated){
        return <Redirect to="/dashboard"/>
    }
    
    if(loading){
        return <LoadingScreen/>
    }

    return (
        <div className="LoginParent">
            <AppBar position="static" style={{backgroundColor:"#FFF"}}>
                <Toolbar>
                    <IconButton edge="start">
                        <img src={Logo} width="40" alt="Logo"/>
                    </IconButton>
                    <Typography className="logoFont navbar-brand" variant="h6">
                        Serve My Table
                    </Typography>
                </Toolbar>
            </AppBar>
            <div className="LoginChild">
                {isMobile || isMobileDevice ? 
                    <form onSubmit={e=> onSubmit(e)}>
                    <Box style={{marginLeft:"5px"}}>
                        <p className="mFont" style={{textAlign:"center"}}>Register with Serve My Table Account</p>
                        <Divider/>
                        <Alerts/>
                    </Box>
                    <div>
                        <p className="mFont" style={{marginTop:10}}>Select Plan</p>
                        <Box display="flex" alignContent="center" justifyContent="center">
                        <Box flexDirection="row" display="flex" justifyContent="space-between">
                            <Box>
                                <CustomRadioButton 
                                    PlanName="Monthly" 
                                    PlanPrice="1000" 
                                    selected={PlanSelected.Monthly}
                                    onClick={()=>{setSelected({
                                        Monthly:true,
                                        Quaterly:false
                                    })
                                    setFormData({...formData,Plan:"MONTHLY"});
                                    }
                                    }    
                                    />
                            </Box>
                            <Box>
                                <CustomRadioButton 
                                    PlanName="Quaterly" 
                                    PlanPrice="3000" 
                                    selected={PlanSelected.Quaterly}
                                    onClick={()=>{setSelected({
                                        Monthly:false,
                                        Quaterly:true
                                    })
                                    setFormData({...formData,Plan:"QUATERLY"});
                                    }
                                    }
                                    />
                            </Box>
                        </Box>
                        </Box>
                    </div>
                    <div>
                        <CustomTextField 
                            className={classes.mobileLoginInput}
                            variant="outlined" 
                            name="username" 
                            type="text"
                            onChange={e => onChange(e)}
                            value={username} 
                            InputProps={{
                                startAdornment:(
                                    <InputAdornment position="start">
                                        <PersonOutlineOutlinedIcon/>
                                    </InputAdornment>
                                ),
                            }}
                            placeholder="Username *"
                            required
                        />
                    </div>
                    <div>
                        <CustomTextField 
                            className={classes.mobileLoginInput}
                            variant="outlined"  
                            name="email" 
                            type="email"
                            onChange={e => onChange(e)}
                            value={email}
                            style={{marginTop:"5px"}}
                            InputProps={{
                                startAdornment:(
                                    <InputAdornment position="start">
                                        <MailOutlineRoundedIcon/>
                                    </InputAdornment>
                                ),
                            }} 
                            placeholder="Email Address *" 
                            required/>
                    </div>
                    <div>
                        <CustomTextField 
                            className={classes.mobileLoginInput}  
                            name="Phone" 
                            type="number"
                            variant="outlined"
                            onChange={e => onChange(e)}
                            value={Phone}
                            InputProps={{
                                startAdornment:(
                                    <InputAdornment position="start">
                                        <PhoneOutlinedIcon/>
                                    </InputAdornment>
                                ),
                            }}
                            style={{marginTop:"5px"}} 
                            placeholder="Contact No. *" 
                            required/>
                    </div>
                    <div>
                        <CustomTextField
                            className={classes.mobileLoginInput} 
                            variant="outlined"
                            name="password" 
                            type="password"
                            onChange={e => onChange(e)}
                            value={password}
                            InputProps={{
                                startAdornment:(
                                    <InputAdornment position="start">
                                        <LockOutlinedIcon/>
                                    </InputAdornment>
                                ),
                            }}
                            style={{marginTop:"5px"}} 
                            placeholder="Password *" 
                            required/>
                    </div>
                    <div>
                        <CustomTextField
                            className={classes.mobileLoginInput} 
                            name="confirmPassword"
                            variant="outlined" 
                            type="password"
                            onChange={e => onChange(e)}
                            value={confirmPassword}
                            InputProps={{
                                startAdornment:(
                                    <InputAdornment position="start">
                                        <LockOutlinedIcon/>
                                    </InputAdornment>
                                ),
                            }}
                            style={{marginTop:"5px"}}  
                            placeholder="Confirm Password *" 
                            required/>
                    </div>
                    <div className="termsText">
                        <input className="mFont" type="checkbox" required/>
                        <span className="mFont">&nbsp;
                            By Checking this you accept all our<br/>
                            <a href="http://www.servemytable.in/tnc">Terms and Conditions</a> and <a href="http://www.servemytable.in/privacy">Privacy Policies</a>
                        </span>
                    </div>
                    <div>
                        <button type="submit" className="LoginBtn">Register</button>
                    </div>
                </form>
                :
                    <form onSubmit={e=> onSubmit(e)}>
                        <Box style={{marginLeft:"5px"}}>
                            <p className="mFont" style={{textAlign:"center"}}>Register with Serve My Table Account</p>
                            <Box style={{marginLeft:"35%",marginRight:"35%"}}>
                                <Alerts/>
                            </Box>
                        </Box>
                        <div>
                            <p className="mFont">Select Plan</p>
                            <Box display="flex" alignContent="center" justifyContent="center">
                            <Box flexDirection="row" display="flex" justifyContent="space-between">
                                <Box>
                                    <CustomRadioButton 
                                        PlanName="Monthly" 
                                        PlanPrice="1000" 
                                        selected={PlanSelected.Monthly}
                                        onClick={()=>{setSelected({
                                            Monthly:true,
                                            Quaterly:false
                                        })
                                        setFormData({...formData,Plan:"Monthly"});
                                        }
                                        }    
                                        />
                                </Box>
                                <Box>
                                    <CustomRadioButton 
                                        PlanName="Quaterly" 
                                        PlanPrice="3000" 
                                        selected={PlanSelected.Quaterly}
                                        onClick={()=>{setSelected({
                                            Monthly:false,
                                            Quaterly:true
                                        })
                                        setFormData({...formData,Plan:"Quaterly"});
                                        }
                                        }
                                        />
                                </Box>
                            </Box>
                            </Box>
                        </div>
                        <div>
                            <CustomTextField 
                                className={classes.LoginInput} 
                                name="username" 
                                type="text"
                                variant="outlined"
                                onChange={e => onChange(e)}
                                value={username} 
                                InputProps={{
                                    startAdornment:(
                                        <InputAdornment position="start">
                                            <PersonOutlineOutlinedIcon/>
                                        </InputAdornment>
                                    ),
                                }}
                                style={{marginTop:"5px"}}
                                placeholder="Username *"
                                required
                            />
                        </div>
                        <div>
                            <CustomTextField 
                                className={classes.LoginInput}  
                                name="email" 
                                type="email"
                                variant="outlined"
                                onChange={e => onChange(e)}
                                value={email}
                                InputProps={{
                                    startAdornment:(
                                        <InputAdornment position="start">
                                            <MailOutlineRoundedIcon/>
                                        </InputAdornment>
                                    ),
                                }}
                                style={{marginTop:"5px"}} 
                                placeholder="Email Address *" 
                                required/>
                        </div>
                        <div>
                            <CustomTextField 
                                className={classes.LoginInput}  
                                name="Phone" 
                                type="number"
                                variant="outlined"
                                onChange={e => onChange(e)}
                                value={Phone}
                                InputProps={{
                                    startAdornment:(
                                        <InputAdornment position="start">
                                            <PhoneOutlinedIcon/>
                                        </InputAdornment>
                                    ),
                                }}
                                style={{marginTop:"5px"}} 
                                placeholder="Contact No. *" 
                                required/>
                        </div>
                        <div>
                            <CustomTextField
                                className={classes.LoginInput} 
                                name="password" 
                                type="password"
                                variant="outlined"
                                onChange={e => onChange(e)}
                                value={password}
                                InputProps={{
                                    startAdornment:(
                                        <InputAdornment position="start">
                                            <LockOutlinedIcon/>
                                        </InputAdornment>
                                    ),
                                }}
                                style={{marginTop:"5px"}} 
                                placeholder="Password *" 
                                required/>
                        </div>
                        <div>
                            <CustomTextField
                                className={classes.LoginInput} 
                                name="confirmPassword" 
                                type="password"
                                variant="outlined"
                                onChange={e => onChange(e)}
                                value={confirmPassword}
                                InputProps={{
                                    startAdornment:(
                                        <InputAdornment position="start">
                                            <LockOutlinedIcon/>
                                        </InputAdornment>
                                    ),
                                }} 
                                style={{marginTop:"5px"}} 
                                placeholder="Confirm Password *" 
                                required/>
                        </div>
                        <div className="termsText">
                            <input 
                                className="mFont" 
                                type="checkbox" 
                                style={{backgroundColor:"#FFD31D",borderColor:"#FFD31D"}}
                                required/>
                            <span className="mFont">&nbsp;
                                By Checking this you accept all our<br/>
                                <a href="http://www.servemytable.in/tnc">Terms and Conditions</a> and <a href="http://www.servemytable.in/privacy">Privacy Policies</a>
                            </span>
                        </div>
                        
                        <div>
                            <button type="submit" className="LoginBtn">Register</button>
                        </div>
                    </form>
                }
                <a type="button" className="forgotPassword mFont" href="/">Already have an Account?<strong> Login</strong></a>
            </div>
        </div>
    )
}

Register.prototype = {
    setAlert: PropTypes.func.isRequired,
    register: PropTypes.func.isRequired,
    isAuthenticated : PropTypes.bool,
    loading : PropTypes.bool,
    setLoading : PropTypes.func.isRequired
}

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated,
    loading : state.loading
});

export default connect(mapStateToProps,{ setAlert,register,setLoading })(Register);