"use client";

import Image from "next/image";
import React, { useState } from "react";
import useSWR from "swr";
import Sidebar from "@/components/sideBar";
import Wrapper from "@/components/Class/Wrapper";
import useGetExams from "@/hooks/exams/useGetExams";
import axios from "axios";

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

export default function ClassPage({
  params,
  searchParams,
}: {
  params: any;
  searchParams: any;
}) {
  const [showSidebar, setShowSidebar] = useState(false);
  const { data, error } = useSWR(
    `${process.env.NEXT_PUBLIC_API_URL}/classes`,
    fetcher
  );
  const { exams, loading } = useGetExams(params.id);
  // console.log(exams);
  return (
    <div className="flex bg-gray-200 min-h-screen">
      <Sidebar show={showSidebar} setter={setShowSidebar}/>
      <main className="flex w-[100%] min-h-screen flex-col items-center justify-between p-12">
        {!loading && <Wrapper searchParams={searchParams} data={exams} />}
      </main>
    </div>
  );
}
