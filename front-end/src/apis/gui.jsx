import axios from "axios";

const API_BASE_URL = "http://localhost:8000/invoice";

export function CompanyInfo() {
  return axios.get(`${API_BASE_URL}/company-info/`, {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
}
