import { Outlet } from "react-router-dom";
import "./App.css";
import Header from "./pages/Header";
import { GlobalStateProvider } from "./GlobalStateProvider";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { useState } from "react";

function App() {
  const [open, setOpen] = useState(false);
  const [errorType, setErrorType] = useState("success");
  const [errorMsg, setErrorMsg] = useState("");

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  const newMessage = (error, msg) => {
    if (["success", "error", "warning", "info"].includes(error)) {
      setErrorType(error);
      setErrorMsg(msg);
      setOpen(true);
    }
  };
  return (
    <GlobalStateProvider>
      <Snackbar
        open={open}
        autoHideDuration={4000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleClose}
          severity={errorType}
          sx={{ width: "100%" }}
        >
          {errorMsg}
        </Alert>
      </Snackbar>
      <Header newMessage={newMessage} />
      <Outlet context={[newMessage]} />
    </GlobalStateProvider>
  );
}

export default App;
