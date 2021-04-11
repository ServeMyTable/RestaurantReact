import React from 'react';
import { Box, Divider, Grid, Typography, Paper } from '@material-ui/core';
import { useMediaQuery } from 'react-responsive';
import { makeStyles } from '@material-ui/core/styles';
import Rating from '@material-ui/lab/Rating';
import Axios from 'axios';
import NotInterestedIcon from '@material-ui/icons/NotInterested';
const useStyles = makeStyles((theme)=>({
    mt10:{marginTop:10},
    FeedbacksListGrid:{
        borderRight:"1px solid whitesmoke",   
        paddingTop:20,
        marginBottom:20,
    },
    RatingHeading:{
        fontSize:20,
        letterSpacing:2
    },
    Ratings:{
        fontSize:100,
        textAlign:'center',
        marginTop:30
    },
    customPaper:{
        marginTop:10,
        paddingLeft:10,
        paddingTop:10,
        paddingBottom:5,
        marginRight:20
    }
}));

function Feedback(props) {

    const classes = useStyles(); 
    const isMobile = useMediaQuery({ query: '(max-width: 768px)' });
    const isMobileDevice = useMediaQuery({query: '(max-device-width: 768px)'});

    const [feedbacks,setFeedbacks] = React.useState([]);

    React.useEffect(()=>{

        setTimeout(()=>{
            Axios.get("/api/feedback")
            .then(response=>{
                setFeedbacks(response.data);
            });
        },5000)

    },[]);

    const getAvgStars = () =>{

        let num = 0;
        for(var i = 0 ; i<feedbacks.length ; i++){
            num += Number.parseInt(feedbacks[i].stars);
        }
        if(feedbacks.length <= 0){
            return num
        }else{
            return (num/feedbacks.length).toFixed(1) ;
        }
    };

    return (
        isMobile || isMobileDevice ?
        <Box style={{marginLeft:10,marginRight:10}}>  
            <Box>
                <h3 className="mFont"> Feedback </h3>
                <Divider className={classes.mt10}/>
            </Box>
            <Box>
                <Box textAlign="center">
                    <Typography className={classes.Ratings}>{getAvgStars()}</Typography>
                    <Rating precision={0.5} value={getAvgStars()} readOnly />
                </Box>
            </Box>
            <Box>
                <Typography className={classes.RatingHeading}>REVIEWS</Typography>

                {   feedbacks.length > 0 ?
                    feedbacks.slice(0).reverse().map((feedback)=>{
                        return(
                            <Paper className={classes.customPaper} key={feedback._id}>
                                <Typography>{feedback.Name ? feedback.Name : "Anonymous"}</Typography>
                                <Typography>{feedback.stars && feedback.stars}⭐</Typography>
                                <p className="mFont">{feedback.feedback && feedback.feedback}</p>
                            </Paper>
                        )
                    })
                    :
                    <Box style={{width:"100%",marginTop:40}}>
                        <Typography style={{textAlign:"center"}}><NotInterestedIcon/></Typography>
                        <Typography style={{textAlign:"center"}}>No Reviews given yet</Typography>
                    </Box>
                }
            </Box>
        </Box>
        :
        <Box>
            <Box>
                <h3 className="mFont"> Feedback </h3>
                <Divider className={classes.mt10}/>
            </Box>
            <Grid container>
                <Grid item sm={8} xs={8} className={classes.FeedbacksListGrid}>
                    
                    <Typography className={classes.RatingHeading}>REVIEWS</Typography>
                    {
                        feedbacks.length > 0 ?
                        feedbacks.slice(0).reverse().map((feedback)=>{
                            return(
                                <Paper className={classes.customPaper} key={feedback._id}>
                                    <Typography>{feedback.Name ? feedback.Name : "Anonymous"}</Typography>
                                    <Typography>{feedback.stars && feedback.stars}⭐</Typography>
                                    <p className="mFont">{feedback.feedback && feedback.feedback}</p>
                                </Paper>
                            )
                        })
                        :
                        <Box style={{width:"100%",marginTop:40}}>
                            <Typography style={{textAlign:"center"}}><NotInterestedIcon/></Typography>
                            <Typography style={{textAlign:"center"}}>No Reviews given yet</Typography>
                        </Box>
                    }

                </Grid>
                <Grid item sm={4} xs={4} style={{padding:20}}>
                    <Typography className={classes.RatingHeading}>RATINGS</Typography>
                    <Box textAlign="center">
                    <Typography className={classes.Ratings}>{getAvgStars()}</Typography>
                    <Rating precision={0.5} value={getAvgStars()} readOnly />
                    </Box>
                </Grid>
            </Grid>
        </Box>
    );
}

export default Feedback;