"use client";

import Image from "next/image";

export default function Login() {
  return (
    <main className="flex bg-gray-200 min-h-screen  relative p-[15vh] pl-[20vw] pr-[20vw] align-middle">
      <div className=" max-w-5xl w-[50%] items-center justify-center font-mono text-sm lg:flex max-h-[100%] min-h-full  relative bg-[#444444] rounded-tl-xl rounded-bl-xl">
        <Image
          className="relative"
          src="/gpass-logo.png"
          alt="GPASS Logo"
          layout="fill"
          objectFit="contain"
        />
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
              window.open("http://localhost:5000/auth/google", "_blank");
            }}
          >
            <h1 className="text-2xl font-bold">Login with Google</h1>
          </button>
        </div>
      </div>
    </main>
  );
}
