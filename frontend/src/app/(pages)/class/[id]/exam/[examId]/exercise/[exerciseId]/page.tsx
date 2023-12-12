"use client";

import React, { useState } from "react";
import {
  Breadcrumbs,
  BreadcrumbItem,
  CircularProgress,
} from "@nextui-org/react";
import MarkdownRender from "@components/MarkdownRender";
import AnswersAccordion from "@/components/Answer/AnswerAccordion";
import useSWR from "@/hooks/useSWR";
import useGetExamsDetails from "@/hooks/exams/useGetExamsDetails";
import useGetExercisesDetails from "@/hooks/exercises/useGetExercisesDetails";
import ExerciseDetailsSection from "@/components/Exercise/ExerciseDetailSection";

export default function ExercisePage({ params }: { params: any }) {
  const { examDetails, loading } = useGetExamsDetails(params.examId);
  const { exerciseDetails, loading: exerciseLoading } = useGetExercisesDetails(
    params.exerciseId
  );
  const { data, error, isLoading } = useSWR(
    `${process.env.NEXT_PUBLIC_API_URL}/answers/${params.exerciseId}`
  );

  console.log("examDetails", examDetails);
  console.log("exerciseDetails", exerciseDetails);
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
        <BreadcrumbItem href={`/class/${params.id}/exam/${params.examId}`}>
          {!loading && examDetails?.main_file
            ? decodeURIComponent(
                examDetails.main_file
                  .replace(/^.*[\\\/]/, "")
                  .replace(/\..+$/, "")
              )
            : "Exam"}
        </BreadcrumbItem>
        <BreadcrumbItem>
          {!exerciseLoading && exerciseDetails?.question ? (
            <MarkdownRender
              content={`${
                exerciseDetails?.question.length > 10
                  ? exerciseDetails?.question.substring(0, 10) + "..."
                  : exerciseDetails?.question
              }`}
              style={{}}
            />
          ) : (
            "Exercise"
          )}
        </BreadcrumbItem>
      </Breadcrumbs>
      {loading && exerciseLoading &&(
        <div className="self-center">
          <CircularProgress aria-label="Loading..." />
        </div>
      )}
      {!loading && !exerciseLoading && Object.keys(exerciseDetails).length > 0 && (
        <ExerciseDetailsSection
          examDetails={examDetails}
          exerciseDetails={exerciseDetails}
        />
      )}
      {!isLoading && (data?.data as any).length == 0 && (
        <div className="flex flex-col items-center justify-center">
          <div className="color-[#2f3037] text-2xl font-bold">沒有回答</div>
        </div>
      )}
      {!isLoading && (data?.data as any).length > 0 && (
        <AnswersAccordion answers={data} />
      )}
    </div>
  );
}
