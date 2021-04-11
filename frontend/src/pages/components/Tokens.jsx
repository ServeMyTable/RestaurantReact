import React from 'react';

import { getTokens, addToken, removeToken, changeStatus } from "../../actions/token";
import { connect } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import { useMediaQuery } from 'react-responsive';

import AddIcon from '@material-ui/icons/Add';
import NotInterestedIcon from '@material-ui/icons/NotInterested';
import DeleteIcon from '@material-ui/icons/Delete';

import Alert from './Alerts';

import { 
    Box, Divider, Grid, Button, Typography, TextField,
    Card, CardContent, CardActions, Dialog, DialogTitle,
    DialogActions, DialogContent
} from "@material-ui/core";
import { setLoading } from '../../actions/loading';
import Loading from './Loading';

const useStyles = makeStyles((theme)=>({
    mlr10 : {
        marginLeft : '10px',
        marginRight : '10px'
    },
    mtb10:{
        marginTop:10,
        marginBottom:10,
    }
}));

function Tokens({getTokens, addToken, removeToken, changeStatus, tokens, setLoading,loading}) {
    
    const classes = useStyles();

    const isMobile = useMediaQuery({ query: '(max-width: 768px)' });
    const isMobileDevice = useMediaQuery({query: '(max-device-width: 768px)'});

    const [openAddDialog,setOpen] = React.useState(false);
    const [Name,setName] = React.useState('');
    const [NumberOfPeople, setPeople] = React.useState(null);

    function handleClick(){ setOpen(true); }
    function handleClose(){ setOpen(false); }

    const onSubmitDelete = (e) =>{
        e.preventDefault();
        removeToken({CName:e.target[0].value,NOP:e.target[1].value,tokenNo : e.target[2].value});
        setLoading();
    };

    const onSubmitForm = (e) =>{
        e.preventDefault();
        addToken({CustomerName:Name,NoOfPersons:NumberOfPeople});
        setLoading();
        setOpen(false);
    };

    const handleChangeStatus = (e) =>{
        e.preventDefault();
        changeStatus({tokenNo : e.target[0].value});
        setLoading();
    }

    const allTokens = () =>{
        const lst = [];
        for(var i=0 ; i<tokens.length ; i++){
            lst.push(
                <div className="col-md-4">
                    <Card variant="outlined">
                        <CardContent>
                            <Typography variant="h5" component="h2">
                            Token No. {tokens[i].tokenNo}
                            </Typography>
                            <Typography variant="h6" component="h4">
                                {tokens[i].Name}
                            </Typography>
                            <Typography variant="h6" component="h4">
                                No. of People : {tokens[i].NoOfPersons}
                            </Typography>
                        </CardContent>
                        <CardActions style={{marginLeft:10}}>
                            <form onSubmit={(e)=>handleChangeStatus(e)}>
                                <input 
                                    style={{display : "none"}} 
                                    name="tokenNo" 
                                    value={tokens[i].tokenNo}
                                    onChange={()=>{}}
                                />
                                <Button 
                                    color="primary"
                                    variant="contained"
                                    type='submit'
                                    disabled={tokens[i].Status === 'Called'}
                                    >Call Customer</Button>
                            </form>
                            
                            <form onSubmit={(e)=>{onSubmitDelete(e)}}>
                                <input 
                                    style={{display : "none"}} 
                                    name="CName" 
                                    value={tokens[i].Name}
                                    onChange={()=>{}}
                                />
                                <input 
                                    style={{display : "none"}} 
                                    name="NOP" 
                                    value={tokens[i].NoOfPersons}
                                    onChange={()=>{}}
                                />
                                <input 
                                    style={{display : "none"}} 
                                    name="tokenNo" 
                                    value={tokens[i].tokenNo}
                                    onChange={()=>{}}
                                />
                                <Button 
                                    startIcon={<DeleteIcon/>}
                                    type="submit" 
                                    color="secondary"
                                    variant="contained">Remove</Button>
                            </form>
                        </CardActions>
                    </Card>
                </div>
            );
        }
        return lst
    };

    const addDialog = () =>{
        return(
            <Dialog open={openAddDialog} onClose={handleClose}>
                <DialogTitle className="mFont">Add Token</DialogTitle>
                <Alert/>
                <form onSubmit={(e)=>onSubmitForm(e)}>
                    <DialogContent>
                    <Box>
                        <TextField 
                            name="CustomerName"
                            variant="outlined"
                            type="text" 
                            className={classes.mtb10}
                            onChange={e => setName(e.target.value)} 
                            label="Customer Name"
                            fullWidth
                            required
                        />
                    </Box>
                    <Box>
                        <TextField 
                            name="NoOfPeople"
                            type="number" 
                            variant="outlined"
                            className={classes.mtb10}
                            onChange={e => setPeople(e.target.value)} 
                            label="No of People"
                            fullWidth
                            required
                        />
                    </Box>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose}> Close </Button>
                        <Button type="submit" variant="contained" color="primary">Add Token</Button>
                    </DialogActions>
                </form>
            </Dialog>
        );
    };

    setTimeout(()=>{
        getTokens();
    },5000);

    if(loading){
        return <Loading/>
    }else
    if(isMobile || isMobileDevice){
        return(
            <Box className={classes.mlr10}>
                <Grid container>
                    <Grid item sm={3} xs={3}>
                        <h3 className="mFont"> Tokens </h3>
                    </Grid>
                    <Grid item sm={9} xs={9}>
                        <Box textAlign="right">
                            <Button 
                                className="mFont yel"
                                startIcon={<AddIcon/>}
                                color="primary"
                                variant="contained" 
                                onClick={handleClick}
                                disableElevation> 
                                Add Token
                            </Button>
                        </Box>
                    </Grid>
                </Grid>
                <Alert/>
                { tokens.length <= 0 ?
                    <Box style={{width:"100%",marginTop:40}}>
                        <Typography style={{textAlign:"center"}}><NotInterestedIcon/></Typography>
                        <Typography style={{textAlign:"center"}}>No Tokens.</Typography>
                    </Box>
                    :
                    <div style={{marginTop : "20px"}}>
                        <div className="row">
                            {allTokens()}
                        </div>
                    </div>
                }

                {addDialog()}
            </Box>
        );
    }else{
        return (
            <Box>
                <Grid container>
                    <Grid item sm={3} xs={3}>
                        <h3 className="mFont"> Tokens </h3>
                    </Grid>
                    <Grid item sm={9} xs={9}>
                        <Box textAlign="right">
                            <Button 
                                className="mFont yel"
                                startIcon={<AddIcon/>}
                                color="primary"
                                style={{marginRight:20}}
                                variant="contained" 
                                onClick={handleClick}
                                disableElevation> 
                                Add Token
                            </Button>
                        </Box>
                    </Grid>
                </Grid>
                <Divider style={{marginTop:10}}/>
                <Alert/>

                { tokens.length <= 0 ?
                    <Box style={{width:"100%",marginTop:40}}>
                        <Typography style={{textAlign:"center"}}><NotInterestedIcon/></Typography>
                        <Typography style={{textAlign:"center"}}>No Tokens.</Typography>
                    </Box>
                    :
                    <div style={{marginTop : "10px"}}>
                        <div className="row">
                            {allTokens()}
                        </div>
                    </div>
                }

                {addDialog()}
            </Box>
        
        );
    }
}

const mapStateToProps = state =>({
    tokens : state.token,
    loading : state.loading
});

export default connect(mapStateToProps,{getTokens, addToken, removeToken, changeStatus, setLoading})(Tokens);