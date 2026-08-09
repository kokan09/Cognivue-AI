import axios from "axios";
import { backend_url } from "../config/config";

const API = axios.create({
    baseURL: backend_url,
    withCredentials : true
});

export default API;