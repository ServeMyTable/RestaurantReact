import React, { useState } from "react";
import { TextField, InputAdornment } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';

const Search = ({ onSearch }) => {
    const [search, setSearch] = useState("");

    const onInputChange = value => {
        setSearch(value);
        onSearch(value);
    };
    return (
        <TextField
            type="text"
            variant='outlined'
            className='mFont'
            style={{ width: "240px"}}
            placeholder="Search"
            value={search}
            InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
                style:{ height:40 } 
              }}
            onChange={e => onInputChange(e.target.value)}
        />
    );
};

export default Search;