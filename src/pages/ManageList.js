import * as React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import TablePagination from "@mui/material/TablePagination";
import { IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import DoneIcon from "@mui/icons-material/Done";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import { ReactSession } from "react-client-session";
import { useNavigate } from "react-router-dom";
import CryptoJS from "crypto-js";
import { useGlobalState } from "../GlobalStateProvider";
import { useOutletContext } from "react-router-dom";

const columns = [
  { id: "id", label: "No", minWidth: 50 },
  { id: "title", label: "Title", minWidth: 250 },
  { id: "dueDate", label: "Due Date", minWidth: 100 },
  { id: "complete", label: "Status", minWidth: 90 },
  {
    id: "actions",
    label: "Actions",
    minWidth: 100,
  },
];

export default function ManageList() {
  const { login, setLogin } = useGlobalState();
  const [newMessage] = useOutletContext();

  const [open, setOpen] = React.useState(false);
  const [dialogTitle, setDialogTitle] = React.useState("");
  const [products, setProducts] = useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const navigate = useNavigate();
  const SECRET_KEY = "rahul1234";
  var email = "";
  const checkLogin = () => {
    email = decryptData("email");
    debugger;
    if (!email) {
      navigate("../login");
    } else {
      setLogin(true);
    }
  };
  const decryptData = (name) => {
    const encrypted = localStorage.getItem(name);
    const decrypted = CryptoJS.AES.decrypt(encrypted, SECRET_KEY).toString(
      CryptoJS.enc.Utf8
    );
    if (!decrypted) return "";
    return JSON.parse(decrypted);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  async function getData() {
    email = decryptData("email");
    await fetch("http://localhost:8090/getData/" + email)
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        debugger;
      })
      .catch((err) => {
        console.log(err);
        newMessage("error", "Error occured. To see full error open console");
      });
  }
  useEffect(() => {
    checkLogin();
    getData();
  }, [login]);

  const [formTitle, setFormTitle] = useState("");
  const [formId, setFormId] = useState("");
  const date = new Date();
  const now = dayjs(date).format("[YYYYescape] YYYY-MM-DD");
  const [formDate, setFormDate] = useState(dayjs(now));

  function addData() {
    email = decryptData("email");
    const data = {
      title: formTitle,
      email: email,
      formDate: dayjs(formDate.$d).format("MM/DD/YYYY"),
    };
    debugger;
    axios
      .post("http://localhost:8090/addList", data)
      .then(function (response) {
        newMessage("success", response.data);
        getData();
        handleClose();
      })
      .catch(function (error) {
        console.log(error);
        newMessage("error", "Error occured. To see full error open console");
      });
  }
  const [dialogButton, setDialogButton] = useState("");
  const editData = (row) => {
    setDialogButton("Update");
    setFormTitle(row.title);
    setFormDate(dayjs(row.dueDate));
    setFormId(row._id);
    setDialogTitle("Update List");
    console.log(row);
    handleClickOpen();
  };
  async function updateData() {
    const data = {
      title: formTitle,
      dueDate: dayjs(formDate.$d).format("MM/DD/YYYY"),
    };
    debugger;
    await axios
      .put("http://localhost:8090/UpdateList/" + formId, data)
      .then((res) => {
        console.log(res);
        handleClose();
        getData();
        newMessage("success", "Task updated");
      })
      .catch((err) => {
        console.log(err);
        newMessage("error", "Error occured. To see full error open console");
      });
  }
  const deleteData = (row) => {
    const cnf = window.confirm("Do you want to delete the list?");
    if (cnf == true) {
      axios
        .delete("http://localhost:8090/DeleteList/" + row._id)
        .then(() => {
          newMessage("success", "Task deleted!");
          getData();
        })
        .catch((err) => {
          console.log(err);
          newMessage("error", "Error occured. To see full error open console");
        });
    }
  };
  const doneTask = (row) => {
    axios
      .put("http://localhost:8090/DoneTask/" + row._id)
      .then(() => {
        newMessage("success", "Task Complete!");
        getData();
      })
      .catch((err) => {
        console.log(err);
        newMessage("error", "Error occured. To see full error open console");
      });
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  return (
    <>
      <div
        style={{
          width: "60%",
          margin: "50px auto 10px",
        }}
      >
        <div style={{ marginLeft: "auto", width: "105px" }}>
          <Button
            variant="outlined"
            style={{ marginLeft: "auto", cursor: "pointer" }}
            onClick={() => {
              setFormDate(dayjs(now));
              setDialogButton("Add");
              setFormTitle("");
              setDialogTitle("Add New");
              handleClickOpen();
            }}
          >
            Add New
          </Button>
        </div>

        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>{dialogTitle}</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              id="title"
              label="Title"
              type="text"
              fullWidth
              variant="standard"
              value={formTitle}
              onChange={(e) => {
                setFormTitle(e.target.value);
              }}
            />
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                value={formDate}
                onChange={(e) => {
                  debugger;
                  setFormDate(dayjs(e));
                }}
                fullWidth
                label="Due Date"
                format="DD/MM/YYYY"
                variant="standard"
                sx={{ marginTop: "20px" }}
              />
            </LocalizationProvider>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button
              onClick={() =>
                dialogButton === "Add" ? addData() : updateData()
              }
            >
              {dialogButton}
            </Button>
          </DialogActions>
        </Dialog>
      </div>
      <Paper
        sx={{
          width: "60%",
          overflow: "hidden",
          marginLeft: "auto",
          marginRight: "auto",
        }}
      >
        <TableContainer sx={{ maxHeight: "80%" }}>
          <Table className="listTable" stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    align={column.align}
                    style={{ minWidth: column.minWidth }}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {products
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  return (
                    <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                      {columns.map((column) => {
                        const value = row[column.id];
                        return (
                          <TableCell key={column.id} align={column.align}>
                            {column.id === "actions" ? (
                              row.complete ? (
                                <>
                                  <IconButton
                                    className="color-white"
                                    onClick={() => editData(row)}
                                  >
                                    <EditIcon />
                                  </IconButton>
                                  <IconButton
                                    className="color-white"
                                    onClick={() => deleteData(row)}
                                  >
                                    <DeleteIcon />
                                  </IconButton>
                                </>
                              ) : (
                                <>
                                  <IconButton
                                    className="color-white"
                                    onClick={() => doneTask(row)}
                                  >
                                    <DoneIcon />
                                  </IconButton>
                                  <IconButton
                                    className="color-white"
                                    onClick={() => editData(row)}
                                  >
                                    <EditIcon />
                                  </IconButton>
                                  <IconButton
                                    className="color-white"
                                    onClick={() => deleteData(row)}
                                  >
                                    <DeleteIcon />
                                  </IconButton>
                                </>
                              )
                            ) : column.id === "id" ? (
                              page * rowsPerPage + index + 1
                            ) : column.id === "complete" ? (
                              value ? (
                                "Completed"
                              ) : (
                                "Incomplete"
                              )
                            ) : column.id === "dueDate" ? (
                              dayjs(row.dueDate).format("DD/MM/YYYY")
                            ) : column.format && typeof value === "number" ? (
                              column.format(value)
                            ) : (
                              value
                            )}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  );
                })}
              {products.length == 0 ? (
                <tr>
                  <td colSpan={4}>
                    <h3 align="center">No List Found!</h3>
                  </td>
                </tr>
              ) : (
                <></>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          className="tablePage"
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={products.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </>
  );
}
