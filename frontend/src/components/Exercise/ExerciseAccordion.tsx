import React from "react";
import { Accordion, AccordionItem, Avatar } from "@nextui-org/react";
import transformDate from "@/utils/transformDate";
import Link from "next/link";

const Subtitle = ({ exercise }: { exercise: any }) => {
  const date = transformDate(exercise.created_at);
  const subtitle = `${exercise.creator_name} - Created at ${date}`;
  if (exercise.updated_at)
    date.concat(` - Updated at ${transformDate(exercise.updated_at)}`);
  return <div className="text-sm text-[#888]">{subtitle}</div>;
};

export default function ExerciseAccordion({ exercises }: { exercises: any }) {
  const defaultContent = "這題目沒有內容，請聯絡發問者或是管理員。";
  const itemClasses = {
    base: "py-0 w-full min-h-[72px] pt-2",
    title: "font-bold text-base text-[#2f3037] flex items-center text-xl",
    trigger:
      "px-2 py-0 data-[hover=true]:bg-default-100 rounded-lg h-14 flex items-center",
    indicator: "font-bold text-base text-[#2f3037] flex items-center text-xl",
    content: "text-medium",
  };

  return (
    <Accordion
      variant="splitted"
      className="w-full gap-4 mx-auto"
      itemClasses={itemClasses}
      motionProps={{
        variants: {
          enter: {
            y: 0,
            opacity: 1,
            height: "auto",
            transition: {
              height: {
                type: "spring",
                stiffness: 500,
                damping: 30,
                duration: 1,
              },
              opacity: {
                easings: "ease",
                duration: 1,
              },
            },
          },
          exit: {
            y: -10,
            opacity: 0,
            height: 0,
            transition: {
              height: {
                easings: "ease",
                duration: 0.25,
              },
              opacity: {
                easings: "ease",
                duration: 0.3,
              },
            },
          },
        },
      }}
    >
      {exercises.data.map((exercise: any) => (
        <AccordionItem
          key={exercise.id}
          aria-label={exercise.question}
          startContent={
            <Avatar
              isBordered
              color="default"
              radius="lg"
              src={
                exercise.creator_photo ? exercise.creator_photo : "/user.svg"
              }
              ImgComponent={exercise.creator_photo ? "img" : "svg"}
              imgProps={{ referrerPolicy: "no-referrer" }}
            />
          }
          title={exercise.question}
          subtitle={<Subtitle exercise={exercise} />}
        >
          <div className="flex items-center gap-2 ml-[64px] mr-2 justify-between">
            <div className="flex-grow">
              {exercise.content ? exercise.content : defaultContent}
            </div>
            <div className="w-9">
              <Link
                href={`/class/${exercise.class_id}/exam/${exercise.exam_id}/exercise/${exercise.id}`}
              >
                {`>>`}
              </Link>
            </div>
          </div>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
