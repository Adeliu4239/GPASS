import axios from "axios";
import getCookies from "@/utils/getCookies";

function createAxiosAuth() {
  const { token } = getCookies();
  console.log("token", token);
  return axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export default createAxiosAuth;
