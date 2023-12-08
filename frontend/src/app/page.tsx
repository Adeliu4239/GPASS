"use client";

import Image from "next/image";
import React, { useState } from "react";
import useSWR from "swr";
import Sidebar from "@/components/sideBar";
import axios from "axios";

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

export default function Home() {
  const [showSidebar, setShowSidebar] = useState(false);
  const { data, error } = useSWR(`${process.env.NEXT_PUBLIC_API_URL}/classes`, fetcher);

  return (
    <div className="flex bg-gray-200 min-h-screen">
      <Sidebar show={showSidebar} setter={setShowSidebar} data={data} />
      <main className="flex w-[100%] min-h-screen flex-col items-center justify-between p-24">
        ddd
      </main>
    </div>
  );
}
