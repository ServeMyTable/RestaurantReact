import { combineReducers } from 'redux';
import alert from './alert';
import auth from './auth';
import menu from './menu';
import dish from './dish';
import history from './history';
import tables from './tables';
import accounts from './accounts';
import employees from './employees';
import loading from './loading';
import subscribe from './subscribe';
import token from './token';
import attendance from './attendance';

export default combineReducers({

    accounts,
    attendance,
    alert,
    auth,
    dish,
    employees,
    history,
    loading,
    menu,
    tables,
    token,
    subscribe
});