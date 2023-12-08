"use client";

import Image from "next/image";
import React, { useState } from "react";
import useSWR from "swr";
import Sidebar from "@/components/sideBar";
import Wrapper from "@/components/Class/Wrapper";
import useGetExamsDetails from "@/hooks/exams/useGetExamsDetails";
import axios from "axios";

export default function ClassPage({
  params,
  searchParams,
}: {
  params: any;
  searchParams: any;
}) {
  const [showSidebar, setShowSidebar] = useState(false);
  const { examDetails, loading } = useGetExamsDetails(params.id);
  // console.log(exams);
  return (
    <div className="flex bg-gray-200 min-h-screen">
      <Sidebar show={showSidebar} setter={setShowSidebar}/>
      <main className="flex w-[100%] min-h-screen flex-col items-center justify-between p-12">
        {loading && <div>Loading...</div>}
        {!loading && <div>{examDetails.class}</div>}
        {/* {!loading && <iframe src={`${examDetails.main_file}`}width="100%" height="600px"></iframe>} */}
      </main>
    </div>
  );
}
