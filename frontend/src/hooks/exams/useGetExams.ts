import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import createAxiosAuth from "@/api/axiosAuth";

export default function useGetExams(clasId: string) {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] =  useState<null | number>(null);

  const getExams = async () => {
    setLoading(true);
    console.log("get exams");
    try {
      const axiosAuth = createAxiosAuth();
      const response = await axiosAuth.get(`/exams/${clasId}`); //`/exams/${clasId}
      console.log("get exams success", response.data);
      setExams(response.data);
      setLoading(false);
    } catch (err) {
      const { status } = (err as { response: { status: number } }).response;
      console.error("獲取考試列表失敗", err);
      setLoading(false);
      setError(status);
    }
  };

  useEffect(() => {
    getExams();
    console.log("first time get exams");
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

  return { exams, loading, error, getExams };
}
