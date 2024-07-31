import axios from "axios";

const API_BASE_URL = "http://localhost:8000/invoice";

const token = localStorage.getItem("token");

export function allUsersInfo() {
  return axios.get(`${API_BASE_URL}/company-workers-info/`, {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
}

export function promoteUser(userId) {
  return axios.post(
    `${API_BASE_URL}/company-workers-info/?id=${userId}&promotion=1`,
    {}, //* 空对象作为请求体，因为这个 API 不需要请求体
    {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
}

export function deleteUser(userId) {
  return axios.post(
    `${API_BASE_URL}/company-workers-info/?id=${userId}&fire=1`,
    {}, //* 空对象作为请求体，因为这个 API 不需要请求体
    {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
}
