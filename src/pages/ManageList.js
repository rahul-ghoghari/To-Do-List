import * as React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import TablePagination from '@mui/material/TablePagination';
import { IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import { ReactSession } from 'react-client-session';
import { useNavigate } from 'react-router-dom';
import CryptoJS from 'crypto-js';


const columns = [
    { id: 'id', label: 'No', minWidth: 100 },
    { id: 'title', label: 'Title', minWidth: 170 },
    { id: 'dueDate', label: 'Due Date', minWidth: 170 },
    {
        id: 'actions',
        label: 'Actions',
        minWidth: 100
    }
];

const rows = [
    { id: 1, title: 'India', dueDate: "09/07/2023" },
    { id: 2, title: 'China', dueDate: "10/07/2023" },
    { id: 3, title: 'Italy', dueDate: "10/10/2023" },
    { id: 4, title: 'United States', dueDate: "10/03/2023" },
    { id: 5, title: 'Canada', dueDate: "10/20/2023" }
];

export default function ManageList() {
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
        debugger
        if (!email) {
            navigate("../login");
        }
    }
    const decryptData = (name) => {
        const encrypted = localStorage.getItem(name);
        const decrypted = CryptoJS.AES.decrypt(encrypted, SECRET_KEY).toString(CryptoJS.enc.Utf8);
        if (!decrypted)
            return "";
        return JSON.parse(decrypted);
    }
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };
    async function getData() {
        email = decryptData("email");
        await fetch('http://localhost:8090/getData/' + email)
            .then(res => res.json())
            .then(data => {
                setProducts(data);
                debugger;
            });

    }
    useEffect(() => {
        checkLogin();
        getData();
    }, [])
    // function SendData() {

    //     const data = { id: id, title: title };
    //     console.log(data);
    //     axios.post('http://localhost:8090/addList', data)
    //         .then(function (response) {
    //             console.log(response);
    //         })
    //         .catch(function (error) {
    //             console.log(error);
    //         });

    // }

    const [formTitle, setFormTitle] = useState("");
    const [formId, setFormId] = useState("");
    const date = new Date();
    const now = dayjs(date).format('[YYYYescape] YYYY-MM-DD')
    const [formDate, setFormDate] = useState(dayjs(now));

    function addData() {
        email = decryptData("email");
        const data = { title: formTitle, email: email, formDate: dayjs(formDate.$d).format("MM/DD/YYYY") };
        debugger;
        axios.post('http://localhost:8090/addList', data)
            .then(function (response) {
                alert(response.data);
                getData();
                handleClose();
            })
            .catch(function (error) {
                console.log(error);
            });
    }
    const [dialogButton, setDialogButton] = useState("");
    const editData = (row) => {
        setDialogButton('Update');
        setFormTitle(row.title);
        setFormDate(dayjs(row.dueDate));
        setFormId(row._id);
        setDialogTitle('Update List');
        console.log(row);
        handleClickOpen();
    }
    async function updateData() {
        const data = { title: formTitle, dueDate: dayjs(formDate.$d).format("MM/DD/YYYY") };
        debugger;
        await axios.put("http://localhost:8090/UpdateList/" + formId, data)
            .then(res => {
                console.log(res);
                handleClose();
                getData();
            });
    }
    const deleteData = (row) => {
        const cnf = window.confirm("Do you want to delete the list?");
        if (cnf == true) {
            axios.delete("http://localhost:8090/DeleteList/" + row._id).then(() => {
                alert('List Deleted!');
                getData();
            })
        }
    }

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {

        setOpen(false);
    };
    return (
        <>
            <div style={{ width: '60%', marginLeft: 'auto', marginRight: 'auto', marginTop: '50px' }}>
                <div style={{ marginLeft: 'auto', width: "105px" }}>
                    <Button variant="outlined" style={{ marginLeft: 'auto', cursor: 'pointer' }} onClick={() => { setFormDate(dayjs(now)); setDialogButton("Add"); setFormTitle(""); setDialogTitle("Add New"); handleClickOpen(); }}>
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
                            onChange={(e) => { setFormTitle(e.target.value) }}
                        />
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                                value={formDate}
                                onChange={(e) => { debugger; setFormDate(dayjs(e)) }}
                                fullWidth
                                label="Due Date"
                                format='DD/MM/YYYY'
                                variant="standard"
                                sx={{ marginTop: '20px' }}
                            />
                        </LocalizationProvider>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose}>Cancel</Button>
                        <Button onClick={() => dialogButton === 'Add' ? addData() : updateData()}>{dialogButton}</Button>
                    </DialogActions>
                </Dialog>
            </div>
            <Paper sx={{ width: '60%', overflow: 'hidden', marginLeft: 'auto', marginRight: 'auto' }}>
                <TableContainer sx={{ maxHeight: 440 }}>
                    <Table stickyHeader aria-label="sticky table">
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
                                        <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                                            {columns.map((column) => {
                                                const value = row[column.id];
                                                return (

                                                    <TableCell key={column.id} align={column.align}>
                                                        {column.id === "actions" ? <><IconButton onClick={() => editData(row)} ><EditIcon /></IconButton><IconButton onClick={() => deleteData(row)} ><DeleteIcon /></IconButton></> :
                                                            column.id === "id" ? index + 1 :
                                                                column.id === "dueDate" ? dayjs(row.dueDate).format("DD/MM/YYYY") : column.format && typeof value === 'number'
                                                                    ? column.format(value)
                                                                    : value}
                                                    </TableCell>
                                                );
                                            })}
                                        </TableRow>
                                    );
                                })}
                            {products.length == 0 ? <tr><td colSpan={4}><h3 align="center">No List Found!</h3></td></tr> : <></>}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[10, 25, 100]}
                    component="div"
                    count={rows.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Paper>
        </>
    );
}
