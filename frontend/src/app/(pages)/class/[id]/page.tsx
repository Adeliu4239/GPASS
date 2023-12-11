"use client";

import React, { useState } from "react";
import Wrapper from "@/components/Class/Wrapper";

export default function ClassPage({
  params,
  searchParams,
}: {
  params: any;
  searchParams: any;
}) {

  return (
        <Wrapper searchParams={searchParams} classId={params.id} />
  );
}
