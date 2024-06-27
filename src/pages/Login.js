import * as React from "react";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Box } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import CryptoJS from "crypto-js";
import { useGlobalState } from "../GlobalStateProvider";
import { Link } from "react-router-dom";
import { useOutletContext } from "react-router-dom";

export default function Login() {
  const { login, setLogin } = useGlobalState();
  const SECRET_KEY = "rahul1234";
  const baseUrl = "http://localhost:8090/";
  const navigate = useNavigate();
  const checkLogin = () => {
    const email = decryptData("email");
    if (email) {
      setLogin(true);
      navigate("../list");
    }
  };
  const [newMessage] = useOutletContext();

  const decryptData = (name) => {
    const encrypted = localStorage.getItem(name);
    if (!encrypted) {
      return "";
    }
    const decrypted = CryptoJS.AES.decrypt(encrypted, SECRET_KEY).toString(
      CryptoJS.enc.Utf8
    );
    if (!decrypted) return "";
    return JSON.parse(decrypted);
  };
  useEffect(() => checkLogin(), []);

  async function handleSubmit(event) {
    event.preventDefault();
    var user;
    const data = new FormData(event.currentTarget);
    const val = {
      email: data.get("email"),
      password: data.get("password"),
    };
    if (val.email.length > 0 && val.password.length > 0) {
      await axios
        .get(baseUrl + "getUser/" + val.email + "/" + val.password)
        .then((res) => {
          if (res.data.length === 0) {
            // alert("Invalid Email And Password");
            newMessage("error", "Invalid Email And Password");
          } else {
            user = res.data;
          }
        })
        .catch((err) => {
          console.log(err);
        });
      if (user != undefined) {
        newMessage("success", "Login success");
        const encrypted = CryptoJS.AES.encrypt(
          JSON.stringify(user[0].email),
          SECRET_KEY
        ).toString();
        setLogin(true);
        localStorage.setItem("email", encrypted);
        navigate("../list");
      }
    } else {
      newMessage("error", "All fields are required");
    }
  }

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
              Sign in
            </Typography>
            <Box
              component="form"
              onSubmit={handleSubmit}
              noValidate
              className="loginForm"
              sx={{ mt: 1, textAlign: "center" }}
            >
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                className="emailInput"
                name="email"
                autoComplete="off"
                autoFocus
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                className="passInput"
                type="password"
                id="password"
                autoComplete="off"
              />
              <Button type="submit" variant="contained" sx={{ mt: 3, mb: 2 }}>
                Sign In
              </Button>
              <Grid container className="signUpLink">
                <Grid item center>
                  <Link to="/register">Don't have an account? Sign Up</Link>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Container>
      </ThemeProvider>
    </>
  );
}
