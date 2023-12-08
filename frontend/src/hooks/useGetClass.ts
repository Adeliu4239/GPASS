// "use client";

// import { parseCookies } from "nookies";
// import { useState } from "react";
// import axios from "axios"; // 首先，引入 axios
// import useSWR, { useSWRConfig } from "swr";

// export default (url, options) => {
//   const cookies = parseCookies();
//   const { accessToken } = cookies;
//   const { mutate } = useSWRConfig();
//   const [isSent, setIsSent] = useState(false);
//   const { data, error,isLoading } = useSWR(
//     url,
//     async (fetchUrl) => {
//       try {
//         const res = await axios.get(fetchUrl, {
//           headers: { authorization: `Bearer ${accessToken}` }
//         });

//         // Check if the status code is not in the range 200-299
//         if (res.status < 200 || res.status >= 300) {
//           const error = new Error("An error occurred while fetching the data.");
//           error.info = res.data; // axios automatically parses JSON
//           error.status = res.status;
//           throw error;
//         }

//         return res.data; // axios automatically parses JSON

//       } catch (error) {
//         if (error.response) {
//           const axiosError = new Error("An error occurred while fetching the data.");
//           axiosError.info = error.response.data;
//           axiosError.status = error.response.status;
//           throw axiosError;
//         }
//         throw error;
//       }
//     },
//     {
//       onErrorRetry: (error, key, config, revalidate, { retryCount }) => {
//         console.log(`on error retry: ${key}`);
//         if (error.status === 404) return;
//         if (retryCount >= 5) return;
//         setTimeout(() => revalidate({ retryCount }), 5000);
//       },
//       onLoadingSlow: (key) => {
//         console.log(`on loading slow retry: ${key}`);
//         if (!isSent) mutate(url);
//         setIsSent(true);
//       },
//       ...options
//     }
//   );

//   if (error) {
//     console.log(error);
//   }

//   return { data: data?.data, error ,isLoading};
// };