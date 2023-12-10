"use client";

import React, { useState } from "react";
import Sidebar from "@/components/sideBar";
import Wrapper from "@/components/Class/Wrapper";

export default function Home({
  params,
  searchParams,
}: {
  params: any;
  searchParams: any;
}) {
  const [showSidebar, setShowSidebar] = useState(false);

  return (
    <div className="flex bg-gray-200 min-h-screen">
      <Sidebar show={showSidebar} setter={setShowSidebar}/>
      <main className="flex w-[100%] min-h-screen flex-col items-center justify-between px-24 pt-24 overflow-auto">
        <Wrapper searchParams={searchParams} classId={params.id} />
      </main>
    </div>
  );
}
