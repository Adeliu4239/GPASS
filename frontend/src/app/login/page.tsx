"use client";

import { Image } from "@nextui-org/react";
import useLogin from "@/hooks/useLogin";
import { useRouter } from "next/navigation";
import { useSession, signIn, signOut } from "next-auth/react";

const authenticateNYCU = async () =>
{
  const authorizationUrl = 'https://id.nycu.edu.tw/o/authorize/';
  const responseType = 'code';
  const scope = 'profile name';
  // const redirectUri = 'http://localhost:3000/auth/nycu/callback';
  // const redirectUri = 'https://adeliu-stylish.store/auth/nycu/callback';
  const redirectUri = `https://gpass-hazel.vercel.app/auth/nycu/callback`;
  const clientId = process.env.NEXT_PUBLIC_NYCU_CLIENT_ID;
  console.log(clientId);
  const authUrl = `${authorizationUrl}?client_id=${clientId}&response_type=${responseType}&scope=${scope}&redirect_uri=${redirectUri}`;

  window.location.href = authUrl;
}

export default function Login() {
  const { handleLoginWithGoogle, isLoading, error } = useLogin();
  // const router = useRouter();

  return (
    <main className="flex bg-gray-200 min-h-screen  relative p-[15vh] pl-[20vw] pr-[20vw] align-middle">
      <div className=" max-w-5xl w-[50%] items-center justify-center font-mono text-sm lg:flex max-h-[100%] min-h-full  relative bg-[#444444] rounded-tl-xl rounded-bl-xl">
        <Image className="relative" src="/gpass-logo.png" alt="GPASS Logo" />
      </div>
      <div className=" max-w-5xl w-[50%] items-center  font-mono text-sm lg:flex flex-col max-h-[100%] min-h-full  relative bg-[#f9f9f9] rounded-tr-xl rounded-br-xl justify-around">
        <div id="Title" className="flex justify-center items-center w-full">
          <h1 className="text-4xl font-bold text-gray-800">Login</h1>
        </div>
        <div
          id="Login Btn"
          className="flex flex-col justify-center items-center w-full"
        >
          <button
            className="flex justify-center items-center w-[80%] h-12 bg-[#444444] text-white rounded-md hover:bg-[#333333] transition-all duration-200"
            onClick={() => {
              signIn("google");
            }}
          >
            <h1 className="text-2xl font-bold">Login with Google</h1>
          </button>
        </div>
        <div
          id="Login Btn NYCU"
          className="flex flex-col justify-center items-center w-full"
        >
          <button
            className="flex justify-center items-center w-[80%] h-12 bg-[#444444] text-white rounded-md hover:bg-[#333333] transition-all duration-200"
            onClick={() => {
              authenticateNYCU();
            }
            }
          >
            <h1 className="text-2xl font-bold">Login with NYCU</h1>
          </button>
        </div>
      </div>
    </main>
  );
}
