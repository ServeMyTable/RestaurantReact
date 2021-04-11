import React from 'react';
import { 
    Accordion, AccordionDetails, AccordionSummary, 
    Box, CircularProgress, Grid,
    Button, Divider, Typography 
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import SendIcon from '@material-ui/icons/Send';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import YouTubeIcon from '@material-ui/icons/YouTube';
import WhatsAppIcon from '@material-ui/icons/WhatsApp';
import { lightGreen } from '@material-ui/core/colors'
import { sendMessage } from '../../actions/alert';
import { setLoading } from '../../actions/loading'
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import Alert from './Alerts';
import { useMediaQuery } from 'react-responsive';

const ColorButton = withStyles((theme) => ({
    root: {
      color: lightGreen[500],
      borderColor : lightGreen[500],
      '&:hover': {
        color: lightGreen[700],
        borderColor : lightGreen[700],
      },
    },
  }))(Button);

function Help({sendMessage, setLoading, loading}){

    const [Subject,setSubject] = React.useState("");
    const [Message,setMessage] = React.useState("");

    function handleSubmit(e){
        e.preventDefault();
        sendMessage({message : Message , subject : Subject}); 
        setLoading();       
    }
    
    const isMobile = useMediaQuery({ query: '(max-width: 768px)' });
    const isMobileDevice = useMediaQuery({query: '(max-device-width: 768px)'});

    return(
        <div>

            {isMobile || isMobileDevice ?
                <Box style={{marginLeft:"10px",marginRight:"10px"}}>
                <Grid container>
                    <Grid item sm={6} xs={6}>
                        <h3 className="mFont"> Help </h3>
                    </Grid>
                    <Grid item sm={6} xs={6}>
                        <Box textAlign="right">
                        <ColorButton
                            startIcon={<WhatsAppIcon/>}
                            href="https://api.whatsapp.com/send?phone=+919730525275"
                            variant="outlined"
                            >
                            WhatsApp
                        </ColorButton>
                        </Box>
                    </Grid>
                </Grid>
                
                <br/>
                </Box>
            :
            <Box>
                <Grid container> 
                    <Grid item sm={6} xs={6}>
                        <h3 className="mFont"> Help </h3>
                    </Grid>
                    <Grid item sm={6} xs={6}>
                        <Box textAlign="right" className="mr-20">
                        <ColorButton
                            startIcon={<WhatsAppIcon/>}
                            href="https://api.whatsapp.com/send?phone=+919730525275"
                            variant="outlined"
                            >
                            WhatsApp
                        </ColorButton>
                        </Box>
                    </Grid>
                </Grid>
                
                <Divider style={{marginTop:10}}/>
                <br/>
            </Box>
            }

            {isMobile || isMobileDevice ? 
                
                <Box style={{marginLeft:"10px",marginRight:"10px"}}>
                    <p className="mFont"><strong>Feel free to message us.</strong></p>
                    <Alert/>
                    <form onSubmit={handleSubmit}>
                        <input
                            type="text" 
                            className="form-control mFont"
                            placeholder="Subject"
                            name="Subject"
                            onChange={(e)=>setSubject(e.target.value)}
                            required
                        />
                        <br/>
                        <textarea 
                            type="text" 
                            className="form-control mFont" id="message" 
                            placeholder="Message" rows="3"
                            name="Message"
                            onChange={(e)=>setMessage(e.target.value)}
                            required
                            ></textarea>
                        <br/>
                        <Button 
                            variant="contained" 
                            color="primary" 
                            startIcon={<SendIcon/>}
                            type="submit"> 
                            Send Message 
                        </Button>

                    </form>
                    <br/>
                    <p className="mFont"> <strong>Note </strong>: We will get back to you within next 3 working days. </p>

                    <p className="mFont"><strong>FAQ's</strong></p>

                    <Accordion>
                        <AccordionSummary expandIcon={<ExpandMoreIcon/>}>
                            <Typography>
                                Add, Update, Delete Dishes
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Typography>
                                <ol>    
                                    <li>Login with your registered email id and password.
                                    </li><li>   Press the “Dishes” button on the navigation bar.
                                    </li><li>Click on “Add Dish” button.
                                    </li><li>Fill in the basic details of the dish you wish to add.
                                    </li><li>You can edit details of a particular dish easily whenever you want and even hide a dish from menu card.
                                    </li>    
                                </ol>
                                <Button 
                                variant="contained" 
                                color="secondary" 
                                startIcon={<YouTubeIcon/>}
                                href="https://youtu.be/trFoasyG4yI"
                                >YouTube</Button>
                                
                            </Typography>
                        </AccordionDetails>
                    </Accordion>

                    <Accordion>
                        <AccordionSummary expandIcon={<ExpandMoreIcon/>}>
                            <Typography>
                                Get, Print QR Codes
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Typography>
                                <ol>    
                                    <li>Login with your registered email id and password.
                                    </li><li>Press the “QR Code” button on the navigation bar.
                                    </li><li>Print QR Code by clicking on “Print codes” button.
                                    </li><li>To generate codes go to My Account and edit number of Tables.
                                    </li>    
                                </ol>
                                <Button 
                                variant="contained" 
                                color="secondary" 
                                startIcon={<YouTubeIcon/>}
                                href="https://youtu.be/r6QFXeuVJVw"
                                >YouTube</Button>
                                
                            </Typography>
                        </AccordionDetails>
                    </Accordion>


                    <Accordion>
                        <AccordionSummary expandIcon={<ExpandMoreIcon/>}>
                            <Typography>
                                Order cancellation
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Typography>
                                Order once placed cannot be cancelled by the guest.
                                Order can be cancelled by the restaurant.
                            </Typography>
                        </AccordionDetails>
                    </Accordion>



                </Box>

            :
            
                <Grid container spacing={2}>
                    <Grid item sm={5} xs={5}>
                        <p className="mFont">Feel free to message us.</p>
                        <Alert/>
                        <form onSubmit={handleSubmit}>
                            <input
                                type="text" 
                                className="form-control mFont"
                                placeholder="Subject"
                                name="Subject"
                                onChange={(e)=>setSubject(e.target.value)}
                                required
                            />
                            <br/>
                            <textarea 
                                type="text" 
                                className="form-control mFont" id="message" 
                                placeholder="Message" rows="3"
                                name="Message"
                                onChange={(e)=>setMessage(e.target.value)}
                                required
                                ></textarea>
                            <br/>
                            <Button 
                                variant="contained" 
                                color="primary" 
                                startIcon={<SendIcon/>}
                                type="submit"> 
                                Send Message 
                            </Button>

                        </form>
                        <br/>
                        <p className="mFont"> <strong>Note </strong>: We will get back to you within next 3 working days. </p>
                        {
                            loading && 
                            <Box style={{position:"relative",bottom:200,left:200}}>
                                <CircularProgress/>
                            </Box>
                        }
                        
                    </Grid>
                    <Grid item sm={5} xs={5}>
                        <p className="mFont">FAQ's</p>

                        <Accordion>
                            <AccordionSummary expandIcon={<ExpandMoreIcon/>}>
                                <Typography>
                                    Add, Update, Delete Dishes
                                </Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Typography>
                                    <ol>    
                                        <li>Login with your registered email id and password.
                                        </li><li>   Press the “Dishes” button on the navigation bar.
                                        </li><li>Click on “Add Dish” button.
                                        </li><li>Fill in the basic details of the dish you wish to add.
                                        </li><li>You can edit details of a particular dish easily whenever you want and even hide a dish from menu card.
                                        </li>    
                                    </ol>
                                    <Button 
                                    variant="contained" 
                                    color="secondary" 
                                    startIcon={<YouTubeIcon/>}
                                    href="https://youtu.be/trFoasyG4yI"
                                    >YouTube</Button>
                                    
                                </Typography>
                            </AccordionDetails>
                        </Accordion>

                        <Accordion>
                            <AccordionSummary expandIcon={<ExpandMoreIcon/>}>
                                <Typography>
                                    Get, Print QR Codes
                                </Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Typography>
                                    <ol>    
                                        <li>Login with your registered email id and password.
                                        </li><li>Press the “QR Code” button on the navigation bar.
                                        </li><li>Print QR Code by clicking on “Print codes” button.
                                        </li><li>To generate codes go to My Account and edit number of Tables.
                                        </li>    
                                    </ol>
                                    <Button 
                                    variant="contained" 
                                    color="secondary" 
                                    startIcon={<YouTubeIcon/>}
                                    href="https://youtu.be/r6QFXeuVJVw"
                                    >YouTube</Button>
                                    
                                </Typography>
                            </AccordionDetails>
                        </Accordion>


                        <Accordion>
                            <AccordionSummary expandIcon={<ExpandMoreIcon/>}>
                                <Typography>
                                    Order cancellation
                                </Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Typography>
                                    Order once placed cannot be cancelled by the guest.
                                    Order can be cancelled by the restaurant.
                                </Typography>
                            </AccordionDetails>
                        </Accordion>

                    </Grid>
                </Grid>
            
            }
        </div>

    );
}

Help.propTypes={
    sendMessage : PropTypes.func.isRequired,
    setLoading : PropTypes.func.isRequired,
    loading : PropTypes.bool 
};

const mapStateToProps = state =>({
    loading : state.loading
});

export default connect(mapStateToProps,{sendMessage,setLoading})(Help);