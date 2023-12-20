import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import createAxiosAuth from "@/api/axiosAuth";
import useLogout from "@/hooks/useLogout";

interface Exam {
  id: number;
  name: string;
  year: string;
  type: string;
  hasAns: boolean;
  teacher: string;
  clas: string;
  createdAt: string;
  updatedAt: string;
}

export default function useGetExams(clasId: string, classname:any, teacher: any, year: any, type: any, hasAns: any){
  const [exams, setExams] = <any>useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] =  useState<null | number>(null);

  const { handleLogout } = useLogout();

  const getExams = async () => {
    setLoading(true);
    console.log("get exams");
    try {
      const axiosAuth = createAxiosAuth();
      if (classname === "All") classname = "";
      if (teacher === "All") teacher = "";
      if (year === "All") year = "";
      if (type === "All") type = "";
      if (hasAns === "All") hasAns = "";
      if (hasAns === "有") hasAns = "1";
      if (hasAns === "無") hasAns = "0";
      if (!clasId) clasId = "";
      const response = await axiosAuth.get(`/exams/${clasId}?teacher=${teacher}&year=${year}&type=${type}&hasAns=${hasAns}&class=${classname}`);
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
  }, [teacher, year, type, hasAns]);

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
          handleLogout();
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
