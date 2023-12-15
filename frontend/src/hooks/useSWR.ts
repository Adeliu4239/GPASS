"use client";

import { useState } from "react";
import axios, { AxiosError } from "axios";
import { parseCookies } from "nookies";
import useSWR, {useSWRConfig } from "swr";

interface ErrorResponse {
  info: any; // 這裡應該是一個可以包含錯誤資訊的型別，你可以根據需要調整
  status: number;
}

interface FetcherResponse<T> {
  data: T;
}

export default function useCustomSWR<T>(url: string, options?: any) {
  const cookies = parseCookies();
  const { token } = cookies;
  const { mutate } = useSWRConfig();
  const [isSent, setIsSent] = useState(false);
  const { data, error, isValidating } = useSWR<FetcherResponse<T>, AxiosError>(
    url,
    async (fetchUrl: string) => {
      try {
        const res = await axios.get<FetcherResponse<T>>(fetchUrl, {
          headers: { authorization: `Bearer ${token}` },
        });

        // Check if the status code is not in the range 200-299
        // if (res.status < 200 || res.status >= 300) {
        //   const error = new Error(
        //     "An error occurred while fetching the data."
        //   );
        // //   error.info = res.data; // axios automatically parses JSON
        // //   error.status = res.status;
        //   throw error;
        // }

        return res.data; // axios automatically parses JSON
      } catch (error) {
        if (axios.isAxiosError(error)) {
          const axiosError = new Error(
            "An error occurred while fetching the data."
          ) as AxiosError<ErrorResponse>;
          
        //   axiosError.info = error.response?.data;
        //   axiosError.status = error.response?.status || 500;
          throw axiosError;
        }
        throw error;
      }
    },
    {
      onErrorRetry: (error, key, config, revalidate, { retryCount }) => {
        console.log(`on error retry: ${key}`);
        if (error.status === 404) return;
        if (retryCount >= 5) return;
        setTimeout(() => revalidate({ retryCount }), 5000);
      },
      onLoadingSlow: (key) => {
        console.log(`on loading slow retry: ${key}`);
        if (!isSent) mutate(url);
        setIsSent(true);
      },
      ...options,
    }
  );

  if (error) {
    console.log(error);
  }

  return { data: data , error, isLoading: isValidating };
}
