import axios from "axios";
import { parseCookies } from "nookies";

const axiosFormData = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "multipart/form-data",
    Authorization: `Bearer ${parseCookies().accessToken}`,
  },
});

export default axiosFormData;
