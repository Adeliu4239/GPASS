"use client";

import Image from "next/image";
import React, { useState } from "react";
import {
  Breadcrumbs,
  BreadcrumbItem,
  CircularProgress,
} from "@nextui-org/react";
import useSWR from "@/hooks/useSWR";
import useGetExamsDetails from "@/hooks/exams/useGetExamsDetails";
import ExamDetailSection from "@/components/Exam/ExamDetailSection";
import ExerciseAccordion from "@/components/Exercise/ExerciseAccordion";
import axios from "axios";

export default function ClassPage({ params }: { params: any }) {
  const { examDetails, loading } = useGetExamsDetails(params.examId);
  const { data, error, isLoading } = useSWR(
    `${process.env.NEXT_PUBLIC_API_URL}/exercises/${params.examId}`
  );

  console.log("examDetails", examDetails);
  console.log("data", data);

  return (
    <div className="flex flex-col w-full space-y-8">
      <Breadcrumbs
        underline="hover"
        separator=">"
        size="lg"
        itemClasses={{
          item: "px-2 color-[#888] hover:color-[#2f3037] data-[current=true]:text-black",
          separator: "px-0 color-[#999]",
        }}
      >
        <BreadcrumbItem href="/">Home</BreadcrumbItem>
        <BreadcrumbItem href={`/class/${params.id}`}>
          {!loading ? examDetails?.class : "Class"}
        </BreadcrumbItem>
        <BreadcrumbItem>
          {!loading && examDetails?.main_file
            ? decodeURIComponent(
                examDetails.main_file
                  .replace(/^.*[\\\/]/, "")
                  .replace(/\..+$/, "")
              )
            : "Exam"}
        </BreadcrumbItem>
      </Breadcrumbs>
      {loading && (
        <div className="self-center">
          <CircularProgress aria-label="Loading..." />
        </div>
      )}
      {!loading && examDetails.length != 0 && (
        <ExamDetailSection examDetails={examDetails} />
      )}
      {!isLoading && (data?.data as any).length == 0 && (
        <div className="flex flex-col items-center justify-center">
          <div className="color-[#2f3037] text-2xl font-bold">沒有題目</div>
        </div>
      )}
      {!isLoading && (data?.data as any).length > 0 && (
        <ExerciseAccordion exercises={data} />
      )}
    </div>
  );
}
