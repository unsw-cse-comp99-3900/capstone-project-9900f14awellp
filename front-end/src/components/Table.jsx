import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import FilterListIcon from '@mui/icons-material/FilterList';
import { visuallyHidden } from '@mui/utils';
import { Progress } from 'antd';
import OutlinedAlerts from '../components/Alert';
import axios from 'axios';


function createData(id, invoiceNumber, progress, createTime, updateTime) {
  return {
    id,
    invoiceNumber,
    progress,
    createTime,
    updateTime,
  };
}

// const rows = [
//   createData(1, 'INV001', 30, '2023-01-01', '2023-01-02'),
//   createData(2, 'INV002', 50, '2023-01-02', '2023-01-03'),
//   createData(3, 'INV003', 70, '2023-01-03', '2023-01-04'),
//   createData(4, 'INV004', 100, '2023-01-04', '2023-01-05'),
//   createData(5, 'INV005', 20, '2023-01-05', '2023-01-06'),
// ];

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
  {
    id: 'invoiceNumber',
    numeric: false,
    disablePadding: true,
    label: 'Invoice number',
  },
  {
    id: 'progress',
    numeric: true,
    disablePadding: false,
    label: 'Progress',
  },
  {
    id: 'createTime',
    numeric: true,
    disablePadding: false,
    label: 'Create time',
  },
  {
    id: 'updateTime',
    numeric: true,
    disablePadding: false,
    label: 'Update time',
  },
  {
    id: 'action',
    numeric: true,
    disablePadding: false,
    label: 'Action',
  },
];

function EnhancedTableHead(props) {
  const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } =
    props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{
              'aria-label': 'select all invoices',
            }}
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
            // sx={{ backgroundColor: 'grey', color: 'white' }}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

function EnhancedTableToolbar(props) {
    const { numSelected, selected, handleDelete } = props;

  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
        }),
      }}
    >
      {numSelected > 0 ? (
        <Typography
          sx={{ flex: '1 1 100%' }}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {numSelected} selected
        </Typography>
      ) : (
        <Typography
          sx={{ flex: '1 1 100%' }}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          Invoices Drafts
        </Typography>
      )}

      {numSelected > 0 ? (
         <>
         <Tooltip title="Delete">
         <IconButton onClick={() => handleDelete(selected)}>
             <DeleteIcon />
           </IconButton>
         </Tooltip>
       </>
      ) : (
        <Tooltip title="Filter list">
          <IconButton>
            <FilterListIcon />
          </IconButton>
        </Tooltip>
      )}
    </Toolbar>
  );
}

EnhancedTableToolbar.propTypes = {
    numSelected: PropTypes.number.isRequired,
    selected: PropTypes.array.isRequired,
    handleDelete: PropTypes.func.isRequired,
  };
  

export default function EnhancedTable() {
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('createTime');
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [alert, setAlert] = useState(null); // 初始状态设置为null
  const token = localStorage.getItem('token');
  const [rows, setRows] = React.useState([]);

  const Colors = {
    '0%': '#ffccc7',
    '50%': '#ffe58f',
    '100%': '#87d068',
  };
  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = rows.map((n) => n.id);
      setSelected(newSelected);
      console.log('Selected IDs:', newSelected); // Log selected IDs
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }
    setSelected(newSelected);
    console.log('Selected IDs:', newSelected); // Log selected IDs
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleEdit = (selectedIds) => {
    // Add your edit logic here
    console.log('Editing IDs:', selectedIds);
  };

  const handleDelete = (selectedIds) => {
    // Add your delete logic here
    
    console.log('Deleting IDs:', selectedIds);
  };


  const isSelected = (id) => selected.indexOf(id) !== -1;

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

    const visibleRows = React.useMemo(
        () =>
            stableSort(rows, getComparator(order, orderBy)).slice(
            page * rowsPerPage,
            page * rowsPerPage + rowsPerPage,
            ),
        [order, orderBy, page, rowsPerPage, rows],
        );
      

  const fetchDraftData = useCallback(() => {
   
    axios.get('http://localhost:8000/invoice/invoice-draft', {
        headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => {
        console.log(response.data.msg);
        console.log(response.data.data);
        const dData = response.data.data.map(item => createData(
            item.id,
            item.invoice_num,
            item.prograss,
            item.create_date,
            item.update_date
          ));
          setRows(dData);  // Set the state with the fetched data
    })
    .catch(error => {
        console.log(error.message);
        setAlert({ severity: 'error', message: error.message });
    });
}, [token]);

useEffect(() => {
    fetchDraftData();
}, [fetchDraftData]);

  return (
    <div>
        
      {alert && (
      <div style={{
          position: 'fixed',
          top: '11vh',
          right: 10,
          width: '30%',
          zIndex: 9999
      }}>
          <OutlinedAlerts severity={alert.severity} onClose={() => setAlert(null)}>
              {alert.message}
          </OutlinedAlerts>
      </div>
      )}
        <Box sx={{ width: '100%', marginTop: "10px",}}>
      <Paper sx={{ width: '100%', mb: 2 }}>
        <EnhancedTableToolbar 
        numSelected={selected.length} 
        selected={selected}
        handleDelete={handleDelete} 
        />
        <TableContainer>
          <Table
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
          >
            <EnhancedTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
            />
            <TableBody>
              {visibleRows.map((row, index) => {
                const isItemSelected = isSelected(row.id);
                const labelId = `enhanced-table-checkbox-${index}`;

                return (
                  <TableRow
                    hover
                    onClick={(event) => handleClick(event, row.id)}
                    role="checkbox"
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={row.id}
                    selected={isItemSelected}
                    sx={{ cursor: 'pointer', bgcolor: isItemSelected ? 'rgba(0, 0, 0, 0.08)' : 'inherit', color: 'inherit' }}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        color="primary"
                        checked={isItemSelected}
                        onClick={(event) => handleClick(event, row.id)} // Attach handleClick to checkbox
                        inputProps={{
                          'aria-labelledby': labelId,
                        }}
                      />
                    </TableCell>
                    <TableCell
                      component="th"
                      id={labelId}
                      scope="row"
                      padding="none"
                    >
                      {row.invoiceNumber}
                    </TableCell>
                    <TableCell align="right">
                      <Progress percent={row.progress} size="small" strokeColor={Colors} status="active"/>
                    </TableCell>
                    <TableCell align="right">{row.createTime}</TableCell>
                    <TableCell align="right">{row.updateTime}</TableCell>
                    <TableCell align="right">
                      <IconButton onClick={() => handleEdit([row.id])}>
                        <EditIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })}
              {emptyRows > 0 && (
                <TableRow
                  style={{
                    height: 53 * emptyRows,
                  }}
                >
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 15]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelDisplayedRows={({ from, to, count }) => `${from}-${to} of ${count}`}
        />
      </Paper>
    </Box>
    </div>
    
  );
}
