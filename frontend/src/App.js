import React, { useEffect } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Forgot from './pages/Forgot';
import PrivateRoute from './pages/routing/PrivateRoute';

import { Provider } from 'react-redux';
import store from './store';
import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles';

import { loadUser } from './actions/auth';
import setAuthToken from './utils/setAuthToken';

if(localStorage.token){
    setAuthToken(localStorage.token);
}

const customTheme = createMuiTheme({
    typography: {
     "fontFamily": `"Noto Sans", "Roboto", "Arial", sans-serif`,
     "fontSize": 14,
     "fontWeightRegular": 400,
     "fontWeightBold":700,
    },
});

function App() {
    
    useEffect(()=>{
        store.dispatch(loadUser());
    },[]);

    return (
        
        <ThemeProvider theme={customTheme}>
        <Provider store={store}>
            <BrowserRouter>
                <section>
                    <Switch>
                        <Route exact path="/" component={Login}/>
                        <Route exact path="/register" component={Register}/>
                        <Route exact path="/forgot" component={Forgot}/>
                        <PrivateRoute exact path="/dashboard" component={Dashboard}/>
                    </Switch>
                </section>
            </BrowserRouter>
        </Provider>
        </ThemeProvider>
       
    );
}

export default App;
