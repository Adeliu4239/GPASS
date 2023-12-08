// useLogin.js
import { useState } from "react";
import { useRouter } from "next/navigation";
import { setCookie } from "nookies";
import Swal from "sweetalert2";
import axiosInstance from "@/api/axiosInstance";

const useLogin = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  const handleLoginWithGoogle = () => {
    setIsLoading(true); // 開始 API 請求時設置 isLoading 為 true
    axiosInstance
      .get("/auth/google")
      .then((response) => {
        if (response.status === 200) {
          // console.log("登入成功");
          // setCookie(null, "accessToken", response.data.data.access_token, {
          //   maxAge: 30 * 24 * 60 * 60,
          //   // path: "/",
          // });
          // setCookie(null, "userId", response.data.data.user.id, {
          //   maxAge: 30 * 24 * 60 * 60,
          //   // path: "/",
          // });
          // setCookie(null, "userName", response.data.data.user.name, {
          //   maxAge: 30 * 24 * 60 * 60,
          //   // path: "/",
          // });
          console.log(response.data);
          router.push("/"); // 進入首頁
        } else {
          console.log("登入失敗");
          setError(response.data.message);
          if (response.status >= 500 && response.status < 600) {
            alert("伺服器出現問題，請稍後再試或通知我們的工程團隊。");
          }
        }
      })
      .catch((loginError) => {
        setError(loginError.response);
        // console.log(loginError.response);
        if (
          loginError.response.status >= 500 &&
          loginError.response.status < 600
        ) {
          Swal.fire({
            icon: "error",
            title: "伺服器出現問題",
            text: "請稍後再試或通知我們的工程團隊。",
          });
        }
        if (
          loginError.response.status >= 400 &&
          loginError.response.status < 500
        ) {
          Swal.fire({
            icon: "error",
            title: "登入失敗",
            text: loginError.response.data.error,
          });
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return { handleLoginWithGoogle, isLoading, error };
};

export default useLogin;
