import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { useMediaQuery } from 'react-responsive';
import { 
    Box, Button, Divider, 
    Grid, Typography, TextField,
    Dialog, DialogTitle, DialogContent, Radio,
    RadioGroup, FormControlLabel, DialogActions
} from '@material-ui/core';

import { getAccounts, setAccount } from '../../actions/accounts';
import { getOrders } from '../../actions/history';
import Alerts from './Alerts';

import { Pagination, Search } from "./DataTable";

function Accounts({getAccounts,setAccount,getOrders,accounts,history}) {

    const isMobile = useMediaQuery({ query: '(max-width: 768px)' });
    const isMobileDevice = useMediaQuery({query: '(max-device-width: 768px)'});
    const [open,setOpen]=React.useState(false);
    const [value, setValue] = React.useState('true');
    const [Particulars,setParticulars] = React.useState('');
    const [Amount,setAmount] = React.useState(0);
    const [search,setSearch] = React.useState("");
    const [totalItems, setTotalItems] = React.useState(0);
    const [currentPage,setCurrentPage] = React.useState(1);
    const ITEMS_PER_PAGE = 10;
    const lst = [...history,...accounts];

    const handleOpen = () => { setOpen(true); };
    const handleClose = () => { setOpen(false); };
    const handleParticulars = (event) => { setParticulars(event.target.value) };
    const handleChange = (event) => { setValue(event.target.value); };
    const handleAmount = (event) => { setAmount(event.target.value); };

    function handleSubmit(e){
        e.preventDefault();
        if(value === "true"){
            
            setAccount({
                amountType:value,
                particulars:Particulars,
                credit:Amount,
            });
        }else{
            setAccount({
                amountType:value,
                particulars:Particulars,
                debit:Amount,
            });
        }
        setTimeout(()=>{handleClose();},3000);
    }

    function getTotalCredit() {

        var TotalBill = 0.0;
        for(var i=0 ; i<lst.length ; i++){
            if(lst[i].Date && lst[i].AmountType === true && lst[i].Date.toUpperCase().indexOf(search.toUpperCase()) > -1){
                TotalBill += parseFloat(lst[i].Credit)
            }else
            if(lst[i].CompletedDateOrder && lst[i].AmountType !== false && lst[i].CompletedDateOrder.toUpperCase().indexOf(search.toUpperCase()) > -1){
                
                TotalBill += parseFloat(lst[i].TotalBill)
            }
        }

        return TotalBill;
    }

    function getTotalDebit() {

        var TotalDebit = 0.0;
        for(var i=0 ; i<lst.length ; i++){
            if(lst[i].AmountType === false && lst[i].Date.toUpperCase().indexOf(search.toUpperCase()) > -1){
                TotalDebit += parseFloat(lst[i].Debit);
            }
        }
        return TotalDebit;
    }

    React.useEffect(()=>{
        getAccounts();
        getOrders();
    },[])

    const accountsData = React.useMemo(() => {
        let computedAccounts = lst;
        if (search) {
            let temp = [];
            for(var i = 0 ; i < lst.length ; i++){

                if(lst[i].CompletedDateOrder && lst[i].CompletedDateOrder.toUpperCase().indexOf(search.toUpperCase()) > -1){
                    temp.push(lst[i]);
                }
                if(lst[i].Date && lst[i].Date.toUpperCase().indexOf(search.toUpperCase()) > -1){
                    temp.push(lst[i]);
                }
            }
            computedAccounts = temp;
        }

        setTotalItems(computedAccounts.length);

        //Current Page slice
        return computedAccounts.slice(
            (currentPage - 1) * ITEMS_PER_PAGE,
            (currentPage - 1) * ITEMS_PER_PAGE + ITEMS_PER_PAGE
        );
    }, [currentPage,search]);

    return (
        <Box>
            {
                isMobile || isMobileDevice ?
                <Box style={{marginLeft : "10px",marginRight:"10px"}}>
                <Grid container>
                    <Grid item sm={6} xs={6}>
                        <h3 className="mFont">Accounts</h3>
                    </Grid>
                    <Grid item sm={6} xs={6}>
                        <Box textAlign="right">
                            <Button 
                                className="mFont"
                                color="primary"
                                variant="contained"
                                style={{marginLeft:10}}
                                onClick={handleOpen}
                                disableElevation 
                            >Credit/Debit</Button>
                        </Box>
                    </Grid>
                </Grid>
                </Box>
                :
                <Box>
                <Grid container>
                    <Grid item sm={6} xs={6}>
                        <h3 className="mFont">Accounts</h3>
                    </Grid>
                    <Grid item sm={6} xs={6}>
                        <Box textAlign="right" className="mr-20">
                            <Button 
                                className="mFont"
                                color="primary"
                                variant="contained"
                                style={{marginLeft:10}}
                                onClick={handleOpen}
                                disableElevation 
                            >Credit/Debit</Button>
                        </Box>
                    </Grid>
                </Grid>
                </Box>
            }
            
            <Divider style={{marginTop:10}}/>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle className="mFont">Credit or Debit Account</DialogTitle>
                <form onSubmit={(e)=>handleSubmit(e)} >
                <DialogContent>
                { alert && <Alerts/> }
                <Box style={{margin:10}}>
                    <Typography>Account Type</Typography>
                    <RadioGroup aria-label="AccountType" name="AccountType1" value={value} onChange={handleChange}>
                        <FormControlLabel value="true" control={<Radio />} label="Credit" />
                        <FormControlLabel value="false" control={<Radio />} label="Debit" />
                    </RadioGroup>
                </Box>
                <Box style={{margin:10}}>
                    <TextField
                        variant="outlined"
                        placeholder="Particulars"
                        onChange={handleParticulars}
                        value={Particulars}
                        label="Particulars"
                    />
                </Box>
                <Box style={{margin:10}}>
                    <TextField
                        variant="outlined"
                        type="number"
                        placeholder="Amount"
                        onChange={handleAmount}
                        value={Amount}
                        label="Amount"
                    />
                </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}> Close </Button>
                    <Button variant="contained" color="primary" type="submit">Submit</Button>
                </DialogActions>
                </form>
            </Dialog>

            <Box style={{marginTop:10,marginBottom:10}}>
                <Search
                    onSearch={value => {
                        setSearch(value);
                        setCurrentPage(1);
                    }}
                />
            </Box>
            <div className="row w-100">
                    <div className="col mb-3 col-12 text-center">
                <table className=" table table-striped">
                    <thead style={{backgroundColor:'#FFD31D'}}>
                        <tr>
                            <th className='mFont'>#</th>
                            <th className='mFont'>Date</th>
                            <th className='mFont'>Particulars</th>
                            <th className='mFont'>Debit</th>
                            <th className='mFont'>Credit</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                        accountsData.slice(0).reverse().map((row,index)=>
                            <tr>
                                <th className='mFont'>{ index + 1 }</th>
                                <td className='mFont'>{ row.CompletedDateOrder ? row.CompletedDateOrder : row.Date }</td>
                                <td className='mFont'>{ row.Particulars }</td>
                                <td className='mFont'>{ row.Debit }</td>
                                <td className='mFont'>{ row.TotalBill ? row.TotalBill : row.Credit }</td>
                            </tr>
                        )
                        }       
                    </tbody>
                </table>
            </div>
            </div>
            <Box>
                <Pagination
                    total={totalItems}
                    itemsPerPage={ITEMS_PER_PAGE}
                    currentPage={currentPage}
                    onPageChange={page => setCurrentPage(page)}
                />
            </Box>

            <Box style={{
                    position:"fixed",
                    bottom:0,
                    boxShadow:"0px 3px 6px rgba(0,0,0,0.16)",
                    padding: 20,
                    backgroundColor:"#FFD31D",
                    width: "100%",
                }}
                >
                <Box>
                   
                    <Grid container>
                        <Grid item xs={4} sm={4}>
                            <Typography>Total Debit</Typography>
                            <Typography><strong>{ getTotalDebit() }</strong></Typography>
                        </Grid>
                        <Grid item xs={4} sm={4}>
                            <Typography>Total Credit</Typography>
                            <Typography> <strong>{ getTotalCredit() }</strong> </Typography>
                        </Grid>
                        <Grid item xs={4} sm={4}>
                            <Typography>Balance</Typography>
                            <Typography> <strong>{ getTotalCredit() - getTotalDebit() }</strong> </Typography>
                        </Grid>
                    </Grid>
                    
                    
                </Box>
            </Box>
        </Box>

    );
}

Accounts.propTypes = {
    history : PropTypes.array,
    accounts : PropTypes.array,
    getAccounts : PropTypes.func.isRequired,
    setAccount : PropTypes.func.isRequired,
    getOrders : PropTypes.func.isRequired
};

const mapStateToProps = state => ({
    history : state.history,
    accounts : state.accounts
});

export default connect(mapStateToProps,{ getAccounts, setAccount, getOrders })(Accounts);