import React from 'react';
//import { DataGrid } from '@material-ui/data-grid';

import {  Divider, TableRow, Typography,
          TableHead, TableContainer, TableCell,
          Paper, Box, Collapse, IconButton,
          Table, TableBody, Grid
        } from '@material-ui/core';

import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import { useMediaQuery } from 'react-responsive';
import NotInterestedIcon from '@material-ui/icons/NotInterested';
import { connect } from 'react-redux';
import { getOrders } from '../../actions/history';

import { Pagination, Search } from "./DataTable";

const useRowStyles = makeStyles({
    root: {
      '& > *': {
        borderBottom: 'unset',
      },
    },
});
  
function OrderHistory({getOrders,history}){

    const [searchOrder,setSearch]= React.useState('');
    const isMobile = useMediaQuery({ query: '(max-width: 768px)' });
    const isMobileDevice = useMediaQuery({query: '(max-device-width: 768px)'});
    const [totalItems, setTotalItems] = React.useState(0);
    const [currentPage,setCurrentPage] = React.useState(1);
    const ITEMS_PER_PAGE = 10;

    const historyData = React.useMemo(() => {
      let computedOrders = history;

      if (searchOrder) {
          let temp = [];
          for(var i = 0 ; i< history.length ; i++){
            if(history[i].CompletedDateOrder && history[i].CompletedDateOrder.toUpperCase().indexOf(searchOrder.toUpperCase()) > -1 )
            {
              temp.push(history[i]);
            }
          }
          computedOrders = temp;
      }

      setTotalItems(computedOrders.length);

      //Current Page slice
      return computedOrders.slice(
          (currentPage - 1) * ITEMS_PER_PAGE,
          (currentPage - 1) * ITEMS_PER_PAGE + ITEMS_PER_PAGE
      );
  }, [currentPage, searchOrder]);

    React.useEffect(()=>{
      getOrders();
    },[]);
    
    function Row(props) {
        const { row } = props;
        const [open, setOpen] = React.useState(false);
        const classes = useRowStyles();
        
        return (
          <React.Fragment>
            <TableRow className={classes.root}>
              <TableCell>
                <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
                  {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                </IconButton>
              </TableCell>
              <TableCell component="th" scope="row">
                {row.CompletedDateOrder}
              </TableCell>
              <TableCell>{row.CompletedTimeOrder}</TableCell>
              <TableCell>{row.tableNo}</TableCell>
              <TableCell>{row.TotalBill}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                <Collapse in={open} timeout="auto" unmountOnExit>
                  <Box margin={1}>
                    <Typography variant="h6" gutterBottom component="div">
                      Order Summary
                    </Typography>
                    <Table size="small" aria-label="purchases">
                      <TableHead>
                        <TableRow>
                          <TableCell>Dish Name</TableCell>
                          <TableCell>Quantity</TableCell>
                          <TableCell>Price</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {row.Orders.map((historyRow) => (
                          <TableRow key={historyRow.date}>
                            <TableCell component="th" scope="row">{historyRow.DishName}</TableCell>
                            <TableCell>{historyRow.Quantity}</TableCell>
                            <TableCell>{parseInt(historyRow.Rate) * parseInt(historyRow.Quantity)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </Box>
                </Collapse>
              </TableCell>
            </TableRow>
          </React.Fragment>
        );
    }

    return(
        <div>
            {isMobile || isMobileDevice ?
            <Box style={{marginLeft:"10px",marginRight:"10px"}}>
              <h3 className="mFont">Order History</h3> 
              <br/>
            </Box>
            :
            <Box>
              <h3 className="mFont">Order History</h3>
              <Divider style={{marginTop:10}}/>
            </Box>
            }
            { history.length > 0 ?
            <Box style={{marginTop:10}}>
              <Search
                onSearch={value => {
                    setSearch(value);
                    setCurrentPage(1);
                }}
              />
              <TableContainer component={Paper} style={{marginTop:10}}>
                <Table aria-label="collapsible table">
                    <TableHead style={{backgroundColor:'#FFD31D'}}>
                      <TableRow>
                          <TableCell />
                          <TableCell className='mFont' style={{fontWeight:700}}>Date</TableCell>
                          <TableCell className='mFont' style={{fontWeight:700}}>Time</TableCell>
                          <TableCell className='mFont' style={{fontWeight:700}}>Table No</TableCell>
                          <TableCell className='mFont' style={{fontWeight:700}}>Total Bill</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      { historyData.map((row) => (<Row key={row._id} row={row} />))}
                    </TableBody>
                </Table>
              </TableContainer>
              <div style={{marginTop:20}}>
                  <Pagination
                    total={totalItems}
                    itemsPerPage={ITEMS_PER_PAGE}
                    currentPage={currentPage}
                    onPageChange={page => setCurrentPage(page)}
                  />
              </div>
            </Box>
            :
            <Box style={{width:"100%",marginTop:40}}>
              <Typography style={{textAlign:"center"}}><NotInterestedIcon/></Typography>
              <Typography style={{textAlign:"center"}}>No history available yet.</Typography>
            </Box>
            }
        </div>
    );
}

OrderHistory.propTypes = {
    getOrders : PropTypes.func.isRequired,
    history : PropTypes.array
}
const mapStateToProps = state => ({
    history : state.history
});


export default connect(mapStateToProps,{getOrders})(OrderHistory);