import React from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { login } from '../actions/auth';
import { setLoading } from '../actions/loading';
import Alerts from './components/Alerts';
import { useMediaQuery } from 'react-responsive';
import { 
    TextField, InputAdornment, IconButton, 
    AppBar, Toolbar, Typography, Divider, Box, CircularProgress  
} from '@material-ui/core';
import { withStyles,makeStyles} from '@material-ui/core/styles';
import MailOutlineRoundedIcon from '@material-ui/icons/MailOutlineRounded';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import VisibilityOutlinedIcon from '@material-ui/icons/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@material-ui/icons/VisibilityOffOutlined';
import Logo from '../assets/logo.png';

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

function Login({login, isAuthenticated, loading, setLoading}){
    
    const classes = useStyles();
    
    const [email,setMail] = React.useState("");
    const [password,setPassword] = React.useState("");
    const [visible,setVisible] = React.useState(false);

    const isMobile = useMediaQuery({ query: '(max-width: 768px)' });
    const isMobileDevice = useMediaQuery({query: '(max-device-width: 768px)'});

    function handleVisibility(){ if(visible){setVisible(false);}else{setVisible(true)} }

    function handleEmail(event){
        setMail(event.target.value);
    }
    function handlePassword(event){
        setPassword(event.target.value);
    }

    const onSubmit = e =>{
        e.preventDefault();
        setLoading();
        login(email,password);
    }


    if(isAuthenticated){
        return <Redirect to="/dashboard"/>
    }

    return(
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
            
            {
                isMobile || isMobileDevice ? 
                <form onSubmit={e=>onSubmit(e)}>
                <Box style={{marginLeft:"5px"}}>
                    <p className="mFont">Login to Serve My Table Account</p>
                    <Divider/>
                    <Alerts/>
                </Box>
                <div>
                
                <CustomTextField 
                    name="email"
                    onChange={handleEmail} 
                    value={email} 
                    variant="outlined"
                    className={classes.mobileLoginInput}
                    InputProps={{
                        startAdornment:(
                            <InputAdornment position="start">
                                <MailOutlineRoundedIcon/>
                            </InputAdornment>
                        ),
                    }}
                    type="email"
                    placeholder="Email Address *"
                    required
                    />
            </div>
            <div>
                <CustomTextField 
                    name="password" 
                    onChange={handlePassword} 
                    value={password} 
                    variant="outlined"
                    className={classes.mobileLoginInput}
                    style={{marginTop:"5px"}}
                    InputProps={{
                        startAdornment:(
                            <InputAdornment position="start">
                                <LockOutlinedIcon/>
                            </InputAdornment>
                        ),
                        endAdornment:(
                            <InputAdornment position="end">
                                <IconButton
                                onClick={handleVisibility}
                                >
                                {visible ? <VisibilityOffOutlinedIcon/> : <VisibilityOutlinedIcon/>}
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                    type={visible ? "text" : "password"}
                    placeholder="Password *" 
                    required/>
            </div>
            <div>
                <button type="submit" className="LoginBtn">Login</button>
            </div>
            <div>
                <a type="button" href="/forgot" className="forgotPassword mFont">Forgot Password ?</a>
            </div>
            <div>
                <a type="button" className="forgotPassword mFont" href="/register">Don't have account?<strong> Register</strong></a>
            </div>
            </form>
                
                :
            
                <form onSubmit={e=>onSubmit(e)}>
                    <Box style={{marginLeft:"5px"}}>
                        <p className="mFont" style={{textAlign:"center"}}>Login to Serve My Table Account</p>
                        <Box style={{marginLeft:"35%",marginRight:"35%"}}>
                            <Alerts/>
                        </Box>
                    </Box>
                    
                    <div>
                        
                        <CustomTextField 
                            name="email"
                            onChange={handleEmail} 
                            value={email}
                            variant="outlined" 
                            className={classes.LoginInput}
                            InputProps={{
                                startAdornment:(
                                    <InputAdornment position="start">
                                        <MailOutlineRoundedIcon/>
                                    </InputAdornment>
                                ),
                            }}
                            type="email"
                            placeholder="Email Address *"
                            required
                            />
                    </div>
                    <div>
                        <CustomTextField 
                            name="password" 
                            onChange={handlePassword} 
                            value={password} 
                            className={classes.LoginInput}
                            variant="outlined" 
                            InputProps={{
                                startAdornment:(
                                    <InputAdornment position="start">
                                        <LockOutlinedIcon/>
                                    </InputAdornment>
                                ),
                                endAdornment:(
                                    <InputAdornment position="end">
                                        <IconButton
                                        onClick={handleVisibility}
                                        >
                                        {visible ? <VisibilityOffOutlinedIcon/> : <VisibilityOutlinedIcon/>}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                            type={visible ? "text" : "password"}
                            placeholder="Password *" 
                            required/>
                    </div>
                    <div>
                        <button type="submit" className="LoginBtn">Login</button>
                    </div>
                    <div>
                        <a type="button" href="/forgot" className="forgotPassword mFont">Forgot Password ?</a>
                    </div>
                    <div>
                        <a type="button" className="forgotPassword mFont" href="/register">Don't have account?<strong> Register</strong></a>
                    </div>
                    {
                    loading &&
                    <Box style={{position:"relative", bottom:300}}>
                        <CircularProgress/>
                    </Box>
                    }
                </form>
            }
        </div>
    </div>
    );      
      
}

login.propTypes = {
    login : PropTypes.func.isRequired,
    isAuthenticated : PropTypes.bool,
    loading : PropTypes.bool,
    setLoading : PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated,
    loading : state.loading,
});

export default connect(mapStateToProps,{login, setLoading})(Login);