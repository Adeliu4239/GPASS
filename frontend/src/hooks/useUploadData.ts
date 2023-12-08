import { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import axiosFormData from "@/api/axiosFormData";

interface UploadDataProps {
  className: any;
  grade: any;
  type: string;
  hasAns: string;
  year: any;
  teacher: string;
  mainFile: File | null;
  ansFile: File | null;
}

function useUploadData() {
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<any>(null);
  const [error] = useState<Error | null>(null);

  const uploadData = async (props: UploadDataProps) => {
    setIsLoading(true);
    const formData = new FormData();

    if (props.mainFile) formData.append("main_file", props.mainFile);
    if (props.ansFile) formData.append("ans_file", props.ansFile);

    formData.append(
      "examInfo",
      JSON.stringify({
        className: props.className,
        grade: props.grade,
        type: props.type,
        hasAns: props.hasAns,
        year: props.year,
        teacher: props.teacher,
      })
    );

    try {
      console.log(formData);
      const result = await axiosFormData.post("/exams", formData);
      console.log(result.data);
      setResponse(result.data);
      Swal.fire("Success", "Data uploaded successfully!", "success").then(
        () => {
          window.location.reload();
        }
      );
    } catch (err) {
      console.error();
      Swal.fire("Error", "Failed to upload data!", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, response, error, uploadData };
}

export default useUploadData;
