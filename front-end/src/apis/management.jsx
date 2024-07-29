import axios from "axios";

const API_BASE_URL = "http://localhost:8000/invoice";

const token = localStorage.getItem("token");

export function invoiceBasicInfo() {
  return axios.get(`${API_BASE_URL}/invoice-info/`, {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
}

export function invoiceAdminManage() {
  return axios.get(`${API_BASE_URL}/company-invoice-info/`, {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
}

export function deleteInvoice() {}
