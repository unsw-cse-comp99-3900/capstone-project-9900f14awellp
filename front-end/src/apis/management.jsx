import axios from "axios";

const API_BASE_URL = "http://localhost:8000/invoice";
const STASTIC_URL = "http://localhost:8000";

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

export function invoiceDeletion(uuid) {
  return axios.post(
    `${API_BASE_URL}/invoice-deletion/?uuid=${uuid}`,
    {}, //* 空对象作为请求体，因为这个 API 不需要请求体
    {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
}

export function getErrorReport(uuid) {
  return axios.get(`${API_BASE_URL}/invoice-report?uuid=${uuid}`, {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
}

export function invoiceLog(uuid, userid) {
  return axios.get(
    `${API_BASE_URL}/invoice-time?uuid=${uuid}&userid=${userid}`,
    {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
}
