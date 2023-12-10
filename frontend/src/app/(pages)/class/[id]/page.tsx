"use client";

import React, { useState } from "react";
import Sidebar from "@/components/sideBar";
import Wrapper from "@/components/Class/Wrapper";

export default function ClassPage({
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
      <main className="flex w-[100%] min-h-screen flex-col items-center justify-between p-12 overflow-auto">
        <Wrapper searchParams={searchParams} classId={params.id} />
      </main>
    </div>
  );
}
