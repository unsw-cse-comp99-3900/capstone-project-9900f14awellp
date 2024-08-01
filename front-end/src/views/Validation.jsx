import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { ResponsiveAppBar } from "../components/Navbar";
import { SelectSmall } from "../components/Select";
import { ButtonSizes } from "../components/Buttons";
import { MultipleSelect } from "../components/Select";
import { BasicModal } from "../components/Model";
import waiting from "../assets/waiting.gif";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import List from "@mui/material/List";
import Collapse from "@mui/material/Collapse";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import OutlinedAlerts from "../components/Alert";
import success from "../assets/success.png";
import success from "../assets/success.png";

export default function Validation() {

  const token = localStorage.getItem("token");
  const [showIcon, setShowIcon] = useState(false);
  const [validationReport, setValidationReport] = useState(null);
  const [invoices, setInvoices] = useState([]);
  const [selectedInvoice, setSelectedInvoice] = useState("");
  const [selectedRules, setSelectedRules] = useState([]);
  const [invoiceUuidMap, setInvoiceUuidMap] = useState({});
  const [open, setOpen] = React.useState(true);
  const [alert, setAlert] = useState(null);
  const [validatedStatus, setValidatedStatus] = useState(null);

    const handleClick = () => {
        setOpen(!open);
    };
  
    const rules = [
    "AUNZ_PEPPOL_1_0_10",
    "AUNZ_PEPPOL_SB_1_0_10",
    "AUNZ_UBL_1_0_10",
    "FR_EN16931_CII_1_3_11",
    "RO_RO16931_UBL_1_0_8_EN16931",
    "FR_EN16931_UBL_1_3_11",
    "RO_RO16931_UBL_1_0_8_CIUS_RO",
    ];


  const handleClear = () => {
    setSelectedRules([]);
    setSelectedInvoice("");
  };

  const fetchInvoiceData = useCallback(() => {
    axios
      .get(`http://127.0.0.1:8000/invoice/invoice-info/`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        const passedData = response.data.filter(
          (entry) => entry.state === "unvalidated"
        );
        const invoiceList = passedData.map((entry) =>
          entry.file.split("/").pop()
        );
        const uuidMap = passedData.reduce((acc, entry) => {
          acc[entry.file.split("/").pop()] = entry.uuid;
          return acc;
        }, {});
        setInvoices(invoiceList);
        setInvoiceUuidMap(uuidMap);
      })
      .catch((error) => {
        console.log(error.message);
        setAlert({ severity: "error", message: error.message });
      });
  }, [token]);

  useEffect(() => {
    fetchInvoiceData();
  }, [token, fetchInvoiceData]);

  const handleValidate = () => {
    const selectedUuid = invoiceUuidMap[selectedInvoice];
    if (!selectedUuid) {
      setAlert({ severity: "warning", message: "Please select an invoice" });
      return;
    }
    setShowIcon(true);
    axios
      .post("http://127.0.0.1:8000/invoice/invoice-validation/", null, {
        params: {
          uuid: selectedUuid,
          rules: selectedRules.join(","),
        },
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        const validatedStatus = response.data.validation_report.report.successful;
        setValidatedStatus(validatedStatus);
        setValidationReport(response.data.validation_report);
        console.log(response.data);
        setShowIcon(false);
        handleClear();
        fetchInvoiceData();
      })
      .catch((error) => {
        if (error.response) {
          setAlert({
            severity: "error",
            message: error.response.data.detail || "validate failed",
          });
          setValidationReport(error.response.data.validation_report);
        } else {
          setAlert({ severity: "error", message: error.message });
            console.log(error.message);
        }
        setShowIcon(false);
      });
  };

  return (
    <div>
      <ResponsiveAppBar />
      {alert && (
        <div
          style={{
            position: "fixed",
            top: "11vh",
            right: 10,
            width: "30%",
            zIndex: 9999,
          }}
        >
          <OutlinedAlerts
            severity={alert.severity}
            onClose={() => setAlert(null)}
          >
            {alert.message}
          </OutlinedAlerts>
        </div>
      )}

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "80vh",
        }}
      >
        <h1
          style={{ fontSize: "45px", marginBottom: "16px", fontWeight: "bold" }}
        >
          Validate your E-invoice
        </h1>
        <h6 style={{ fontSize: "15px", marginBottom: "16px", color: "gray" }}>
          please choose your invoice and rules
        </h6>
        <MultipleSelect
          lists={rules}
          onChange={setSelectedRules}
          selected={selectedRules}
        />
        <SelectSmall
          invoices={invoices}
          onChange={(e) => setSelectedInvoice(e.target.value)}
        />
        <ButtonSizes onClick={handleValidate}>Validate</ButtonSizes>
        {showIcon && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              backgroundColor: "rgba(255, 255, 255, 0.7)",
              zIndex: 9999,
            }}
          >
            <img src={waiting} alt="icon" />
          </div>
        )}

        {validatedStatus !== null && (
          validatedStatus ? (
            <div style={{width:'20px'}}>
              <BasicModal
              title="Validation"
              open={validatedStatus}
              onClose={() => setValidatedStatus(null)}
              actions={[
                {
                  label: "OK",
                  onClick: () => setValidatedStatus(null)
                }
              ]}
             
            >
              <div style={{ padding: "10px", textAlign: "center" }}>
                <img src={success} alt="icon" />
              </div>
            </BasicModal>
            </div>
            
          ) : (
            <BasicModal
              title="Validation Result"
              open={!validatedStatus}
              onClose={() => setValidationReport(null)}
            >
              <div style={{ overflowY: "auto", height: "calc(400px)" }}>
                <div>
                  <TableContainer component={Paper}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Attribute</TableCell>
                          <TableCell>Details</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        <TableRow>
                          <TableCell>Statement</TableCell>
                          <TableCell>
                            <Typography color="error" gutterBottom>
                              failed
                            </Typography>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Customer</TableCell>
                          <TableCell>{validationReport?.customer}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>File Name</TableCell>
                          <TableCell>
                            {validationReport?.report?.filename}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Total Errors</TableCell>
                          <TableCell>
                            {validationReport?.report?.firedAssertionErrorsCount}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Total Successful Reports</TableCell>
                          <TableCell>
                            {
                              validationReport?.report
                                ?.firedSuccessfulReportsCount
                            }
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell colSpan={2}>
                            <ListItemButton onClick={handleClick}>
                              <ListItemText primary="Error Codes" />
                              {open ? <ExpandLess /> : <ExpandMore />}
                            </ListItemButton>
                            <Collapse in={open} timeout="auto" unmountOnExit>
                              <List component="div" disablePadding>
                                {validationReport?.report?.allAssertionErrorCodes?.map(
                                  (code, index) => (
                                    <ListItemButton key={index} sx={{ pl: 4 }}>
                                      <ListItemText primary={code} />
                                    </ListItemButton>
                                  )
                                )}
                              </List>
                            </Collapse>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </div>
              </div>
            </BasicModal>
          )
        )}
      </div>
    </div>
  );
}
