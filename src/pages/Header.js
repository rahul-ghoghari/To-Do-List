import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ReactSession } from 'react-client-session';

export default function Header(props) {
    var [isLogin, setIsLogin] = useState(false);
    const checkLogin = () => {
        var email = ReactSession.get('email');

        if (!email) {

            setIsLogin(false);
        } else {
            setIsLogin(true);
        }
    }
    useEffect(checkLogin, []);

    let navigate = useNavigate();
    const changeRoute = () => {
        navigate('/login');
    }
    const userLogout = () => {
        ReactSession.set("email", "");
        ReactSession.set("fname", "");
        ReactSession.set("lname", "");
        checkLogin();
    }

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        To-Do List
                    </Typography>
                    {isLogin ? <Button onClick={userLogout} color="inherit">Log Out</Button> :
                        <Button onClick={changeRoute} color="inherit">LogIn</Button>
                    }
                </Toolbar>
            </AppBar>
        </Box>
    );
}
