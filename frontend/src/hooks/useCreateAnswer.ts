import { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import axiosFormData from "@/api/axiosFormData";

interface UploadDataProps {
  content: string;
  hideName: boolean;
  image_url: File | null;
}

function useCreateAnswer() {
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<any>(null);
  const [error] = useState<Error | null>(null);

  const uploadData = async (props: UploadDataProps, exerciseId: string) => {
    setIsLoading(true);
    const formData = new FormData();

    if (props.image_url) {
      formData.append("image_url", props.image_url);
    }

    formData.append(
      "answerInfo",
      JSON.stringify({
        content: props.content,
        hideName: props.hideName,
      })
    );

    try {
      console.log(formData);
      const result = await axiosFormData.post(
        `/answers/${exerciseId}`,
        formData
      );
      console.log(result.data);
      setResponse(result.data);
      Swal.fire("Success", "Answer creates successfully!", "success").then(
        () => {
          window.location.reload();
        }
      );
    } catch (err) {
      console.error();
      Swal.fire("Error", "Failed to create answer!", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, response, error, uploadData };
}

export default useCreateAnswer;
