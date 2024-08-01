import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { ResponsiveAppBar } from "../components/Navbar";
import { NestedList } from "../components/List";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import { InputTextField } from "../components/Inputs";
import { MultilineTextFields } from "../components/Inputs";
import Button from "@mui/material/Button";
import DeleteIcon from "@mui/icons-material/Delete";
import SendIcon from "@mui/icons-material/Send";
import axios from "axios";
import shipping from "../assets/shipping.gif";
import OutlinedAlerts from "../components/Alert";

export default function Sending() {
  const token = localStorage.getItem("token");
  const [showIcon, setShowIcon] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setlastName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [passedList, setPassedList] = useState([]);
  const [failedList, setFailedList] = useState([]);
  const [unvalidatedList, setUnvalidatedList] = useState([]);
  const [invoiceUuidMap, setInvoiceUuidMap] = useState({});
  const [selectedInvoices, setSelectedInvoices] = useState([]);
  const [alert, setAlert] = useState(null); // 初始状态设置为null
  const { id } = useParams();
  console.log(id);

  const handleClear = () => {
    setFirstName("");
    setlastName("");
    setEmail("");
    setMessage("");
    setSelectedInvoices([]);
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
        console.log(response.data);
        const passedData = response.data.filter(
          (entry) => entry.state === "Passed"
        );
        const failedData = response.data.filter(
          (entry) => entry.state === "Failed"
        );
        const unvalidatedData = response.data.filter(
          (entry) => entry.state === "unvalidated"
        );

        setPassedList(passedData.map((entry) => entry.file.split("/").pop()));
        setFailedList(failedData.map((entry) => entry.file.split("/").pop()));
        setUnvalidatedList(
          unvalidatedData.map((entry) => entry.file.split("/").pop())
        );

        const uuidMap = response.data.reduce((acc, entry) => {
          acc[entry.file.split("/").pop()] = entry.uuid;
          return acc;
        }, {});
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

  const handleSend = () => {
    const uuids = selectedInvoices.map((invoice) => invoiceUuidMap[invoice]);
    const fullMessage = `Dear ${firstName} ${lastName}: \n${message}`;
    if (!uuids) {
      setAlert({ severity: "warning", message: "Please select an invoice" });
      return;
    }
    setShowIcon(true);
    console.log(uuids.join(","), email, fullMessage);
    axios
      .post(
        "http://127.0.0.1:8000/invoice/invoice-sending/",
        { message: fullMessage },
        {
          params: {
            uuids: uuids.join(","),
            email: email,
          },
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        console.log(response.data);
        // alert(response.data.msg);
        setAlert({ severity: "success", message: response.data.msg });
        setShowIcon(false); // 隐藏等待图标
        handleClear();
        fetchInvoiceData();
      })
      .catch((error) => {
        if (error.response) {
          setAlert({
            severity: "error",
            message: error.response.data.detail || "Please input details.",
          });
          //alert(error.response.data.detail || 'Send failed');
        } else {
          setAlert({ severity: "error", message: error.message });
          console.log(error.message);
        }
        setShowIcon(false); // 隐藏等待图标，即使出错也要隐藏
      });
  };

  const handleInvoiceSelection = (invoice) => {
    setSelectedInvoices((prevSelected) =>
      prevSelected.includes(invoice)
        ? prevSelected.filter((item) => item !== invoice)
        : [...prevSelected, invoice]
    );
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
            // transform: 'translateX(-50%)',
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
      <Box
        sx={{
          height: "calc(100vh - 80px)",
          // height: '80vh',
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          borderColor: "divider",
          borderRadius: 2,
          overflow: "hidden",
          // bgcolor: 'background.paper',
          // color: 'text.secondary',
          marginTop: "10px",
          "& svg": {
            m: 1,
          },
        }}
      >
        {/* maxHeight: 'calc(100vh - 300px)', minHeight: 'calc(100vh - 350px)' */}
        <div
          style={{ margin: "30px", overflow: "auto", height: "calc(450px)" }}
        >
          <h1
            style={{
              fontSize: "45px",
              marginBottom: "50px",
              fontWeight: "600",
              fontFamily: "Lexend Deca",
              color: "#333",
            }}
          >
            Choice Invoice
          </h1>
          <NestedList
            passedList={passedList}
            failedList={failedList}
            unvalidatedList={unvalidatedList}
            onInvoiceSelect={handleInvoiceSelection}
            selectedInvoices={selectedInvoices}
          ></NestedList>
        </div>
        <Divider orientation="vertical" variant="middle" flexItem />
        <div style={{ margin: "30px" }}>
          <h1
            style={{
              fontSize: "45px",
              marginBottom: "50px",
              fontWeight: "600",
              fontFamily: "Lexend Deca",
              color: "#333",
            }}
          >
            Sending To
          </h1>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <InputTextField
              label="First Name"
              id="first-name"
              defaultValue="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
            <div style={{ margin: "10px" }}></div>
            <InputTextField
              label="Last Name"
              id="last-name"
              defaultValue="Last Name"
              value={lastName}
              onChange={(e) => setlastName(e.target.value)}
            />
          </div>

          <InputTextField
            label="Email Address"
            id="email-address"
            defaultValue="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <div style={{ margin: "10px" }}></div>
          <MultilineTextFields
            label="Your Message"
            id="your-message"
            defaultValue="Your Message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <div
            style={{
              display: "flex",
              marginTop: "10px",
              justifyContent: "space-between",
            }}
          >
            <Button
              variant="contained"
              startIcon={<DeleteIcon />}
              sx={{ backgroundColor: "#eeeeee", color: "black" }}
              onClick={handleClear}
            >
              Clear
            </Button>
            <Button
              variant="contained"
              endIcon={<SendIcon />}
              sx={{ backgroundColor: "#263238", color: "white" }}
              onClick={handleSend}
            >
              Send
            </Button>
          </div>
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
              <img src={shipping} alt="icon" />
            </div>
          )}
        </div>
      </Box>
    </div>
  );
}
