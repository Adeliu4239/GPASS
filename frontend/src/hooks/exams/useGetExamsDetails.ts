import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import createAxiosAuth from "@/api/axiosAuth";

export default function useGetExams(examId: string) {
  const [examDetails, setExams] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] =  useState<null | number>(null);

  const getExamsDetail = async () => {
    setLoading(true);
    console.log("get examDetails detail");
    try {
      const axiosAuth = createAxiosAuth();
      const response = await axiosAuth.get(`/exams/details/${examId}`); //`/examDetails/${examId}
      console.log("get examDetails detail success", response.data);
      setExams(response.data);
      setLoading(false);
    } catch (err) {
      const { status } = (err as { response: { status: number } }).response;
      console.log("err", err);
      console.error("獲取考試資訊失敗", err);
      setLoading(false);
      setError(status);
    }
  };

  useEffect(() => {
    getExamsDetail();
    console.log("first time get examDetails detail");
  }, []);

  useEffect(() => {
    if (error !== null) {
      if (error === 401) {
        Swal.fire({
          icon: "error",
          title: "No Token",
          text: "Please login first.",
        });
      } else if (error === 403) {
        Swal.fire({
          icon: "error",
          title: "Token expired or not valid",
          text: "Please login again.",
        }).then(() => {
          console.log("expired");
          // handleLogout();
        });
      } else if (error === 500) {
        Swal.fire({
          icon: "error",
          title: "Server error",
          text: "Please try again later or contact the administrator.",
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Please try again later or contact the administrator.",
        });
      }
      setError(null);
    }
  }, [error]);

  return { examDetails, loading, error, getExamsDetail };
}
