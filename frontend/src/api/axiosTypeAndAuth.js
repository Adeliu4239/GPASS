import axios from "axios";
import { parseCookies } from "nookies";

const axiosTypeAndAuth = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${parseCookies().accessToken}`,
  },
});

export default axiosTypeAndAuth;
