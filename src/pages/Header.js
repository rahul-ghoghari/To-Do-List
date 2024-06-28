import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { ReactSession } from "react-client-session";
import { useGlobalState } from "../GlobalStateProvider";

export default function Header(props) {
  const { login, setLogin } = useGlobalState();
  const checkLogin = () => {
    var email = localStorage.getItem("email");
    if (!email) {
      setLogin(false);
    } else {
      setLogin(true);
    }
  };
  useEffect(checkLogin, []);

  let navigate = useNavigate();
  const changeRoute = () => {
    navigate("/login");
  };
  const userLogout = () => {
    debugger;
    localStorage.setItem("email", "");
    localStorage.setItem("fname", "");
    localStorage.setItem("lname", "");
    checkLogin();
    props.newMessage("success", "User Logout");
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            To-Do List
          </Typography>
          {login ? (
            <Button onClick={userLogout} color="inherit">
              Log Out
            </Button>
          ) : (
            <Button onClick={changeRoute} color="inherit">
              LogIn
            </Button>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
}
