import axios from "axios";
import getCookies from "@/utils/getCookies";

function createAxiosAuth() {
  const { accessToken } = getCookies();
  console.log("accessToken", accessToken);
  return axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

export default createAxiosAuth;
