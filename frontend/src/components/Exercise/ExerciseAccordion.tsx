import React from "react";
import { Accordion, AccordionItem, Avatar } from "@nextui-org/react";
import MarkdownRender from "@components/MarkdownRender";
import transformDate from "@/utils/transformDate";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Subtitle = ({ exercise }: { exercise: any }) => {
  const date = transformDate(exercise.created_at);
  let subtitle = `${exercise.creator_name} - Created at ${date}`;
  if (exercise.updated_at)
    subtitle = subtitle.concat(` - Updated at ${transformDate(exercise.updated_at)}`);
  return <div className="text-sm text-[#888]">{subtitle}</div>;
};

export default function ExerciseAccordion({ exercises }: { exercises: any }) {
  const defaultContent = `# 沒有題目內容`;
  const pathname = usePathname();

  const markdownTitleStyle = {
    fontSize: "1.5rem",
    lineHeight: "2rem",
  };

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
              imgProps={{ referrerPolicy: "no-referrer" }}
            />
          }
          title={<MarkdownRender content={`${exercise.question}`} style={markdownTitleStyle} />}
          subtitle={<Subtitle exercise={exercise} />}
        >
          <div className="flex items-center gap-3 ml-[64px] mr-2 justify-between">
            <div className="flex-grow">
              <MarkdownRender
                content={exercise.content ? exercise.content : defaultContent}
                style={{}}
              />
            </div>
            <div className="w-9">
              <Link
                href={`${pathname}/exercise/${exercise.id}`}
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
