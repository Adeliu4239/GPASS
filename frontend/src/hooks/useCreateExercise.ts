import { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import axiosFormData from "@/api/axiosFormData";

interface UploadDataProps {
  question: string;
  content: string;
  exercise_files: File[] | null;
  hideName: boolean;
}

function useCreateExercise() {
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<any>(null);
  const [error] = useState<Error | null>(null);

  const uploadData = async (props: UploadDataProps, examId: string) => {
    setIsLoading(true);
    const formData = new FormData();

    if (props.exercise_files)
      props.exercise_files.forEach((file) => {
        formData.append("exercise_files", file);
      });

    formData.append(
      "exerciseInfo",
      JSON.stringify({
        question: props.question,
        content: props.content,
        hideName: props.hideName,
      })
    );

    try {
      console.log(formData);
      const result = await axiosFormData.post(`/exercises/${examId}`, formData);
      console.log(result.data);
      setResponse(result.data);
      Swal.fire("Success", "Exercise creates successfully!", "success").then(
        () => {
          window.location.reload();
        }
      );
    } catch (err) {
      console.error();
      Swal.fire("Error", "Failed to create exercise!", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, response, error, uploadData };
}

export default useCreateExercise;
