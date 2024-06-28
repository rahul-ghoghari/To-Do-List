import * as React from "react";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import { Link } from "react-router-dom";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Box } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ReactSession } from "react-client-session";
import { useEffect } from "react";
import { useOutletContext } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();
  const baseUrl = process.env.server;
  const checkLogin = () => {
    var email = ReactSession.get("email");
    if (email) {
      navigate("../list");
    }
  };
  const [newMessage] = useOutletContext();

  useEffect(() => checkLogin(), []);

  const handleSubmit = (event) => {
    debugger;
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const val = {
      fname: data.get("fname"),
      lname: data.get("lname"),
      email: data.get("email"),
      password: data.get("password"),
    };
    if (
      val.fname.length > 0 &&
      val.lname.length > 0 &&
      val.password.length > 0 &&
      val.email.length > 0
    ) {
      axios.post(baseUrl + "AddUser", val).then((res) => {
        if (!res.data) {
          newMessage("error", "Email already exist!");
          event.target.email.focus();
        } else {
          newMessage("success", "Register Success");
          navigate("../login");
        }
      });
    } else {
      newMessage("error", "All fields are required");
    }
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
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Typography component="h1" variant="h5">
              Sign up
            </Typography>
            <Box
              component="form"
              onSubmit={handleSubmit}
              noValidate
              className="registerForm"
              sx={{ mt: 1, textAlign: "center" }}
            >
              <TextField
                margin="normal"
                required
                fullWidth
                className="firstNameInput"
                id="fname"
                label="First Name"
                name="fname"
                autoComplete="off"
                autoFocus
              />
              <TextField
                margin="normal"
                required
                className="lastNameInput"
                fullWidth
                id="lname"
                label="Last Name"
                name="lname"
                autoComplete="off"
              />
              <TextField
                margin="normal"
                required
                className="emailInput"
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                validators={["required", "IsEmail"]}
                errorMessages={["this field is required", "email is not valid"]}
                autoComplete="off"
              />
              <TextField
                margin="normal"
                required
                fullWidth
                className="passInput"
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="off"
              />

              <Button type="submit" variant="contained" sx={{ mt: 3, mb: 2 }}>
                Sign Up
              </Button>
              <Grid container className="SignInLink">
                <Grid item>
                  <Link to="/login">{"Already have an account? Sign In"}</Link>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Container>
      </ThemeProvider>
    </>
  );
}
