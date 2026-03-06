import axios from "axios";

const ApiService = axios.create({
  baseURL: "http://localhost:3001/api",
  headers: {
    "Content-Type": "application/json"
  }
});

// REMOVA o interceptor se ele estiver causando confusão agora e use apenas:
export default ApiService;