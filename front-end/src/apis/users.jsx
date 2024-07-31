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
