import * as React from 'react';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Box } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ReactSession } from 'react-client-session';
import { useEffect } from 'react';

export default function Register() {
    const navigate = useNavigate();
    const baseUrl = "http://localhost:8090/";
    const checkLogin = () => {
        var email = ReactSession.get('email');
        if (email) {
            navigate("../list");
        }
    }
    useEffect(checkLogin(), []);

    const handleSubmit = (event) => {
        debugger;
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const val = {
            fname: data.get('fname'),
            lname: data.get('lname'),
            email: data.get('email'),
            password: data.get('password')
        }

        axios.post(baseUrl + "AddUser", val).then((res) => {

            if (!res.data) {
                alert("Email already exist!");
                event.target.email.focus();
            }

            else {
                alert('Register Success');
                navigate('../login');
            }
        })
    };

    const defaultTheme = createTheme();
    return (
        <>
            <ThemeProvider theme={defaultTheme}>
                <Container component="main" maxWidth="xs">
                    <CssBaseline />
                    <Box
                        sx={{
                            marginTop: 8,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                        }}
                    >
                        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                            <LockOutlinedIcon />
                        </Avatar>
                        <Typography component="h1" variant="h5">
                            Sign up
                        </Typography>
                        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1, textAlign: 'center' }}>
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="fname"
                                label="First Name"
                                name="fname"
                                autoComplete="text"
                                autoFocus
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="lname"
                                label="Last Name"
                                name="lname"
                                autoComplete="text"
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="email"
                                label="Email Address"
                                name="email"
                                validators={['required', 'IsEmail']}
                                errorMessages={['this field is required', 'email is not valid']}
                                autoComplete="email"
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                name="password"
                                label="Password"
                                type="password"
                                id="password"
                                autoComplete="current-password"
                            />

                            <Button
                                type="submit"
                                variant="contained"
                                sx={{ mt: 3, mb: 2 }}
                            >
                                Sign Up
                            </Button>
                            <Grid container>

                                <Grid item>
                                    <Link href="./login" variant="body2">
                                        {"Already have an account? Sign In"}
                                    </Link>
                                </Grid>
                            </Grid>
                        </Box>
                    </Box>
                </Container>
            </ThemeProvider>
        </>
    );
}
