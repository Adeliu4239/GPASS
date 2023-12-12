import React from "react";
import { Accordion, AccordionItem, Avatar, Image } from "@nextui-org/react";
import MarkdownRender from "@components/MarkdownRender";
import transformDate from "@/utils/transformDate";
import Link from "next/link";

const Subtitle = ({ answer }: { answer: any }) => {
  const date = transformDate(answer.created_at);
  let subtitle = `Created at ${date}`;
  if (answer.updated_at)
    subtitle = subtitle.concat(
      ` - Updated at ${transformDate(answer.updated_at)}`
    );
  return <div className="text-sm text-[#888]">{subtitle}</div>;
};

export default function AnswerAccordion({ answers }: { answers: any }) {
  const itemClasses = {
    base: "py-0 w-full min-h-[80px] pt-3",
    title: "font-bold text-base text-[#2f3037] flex items-center text-xl",
    trigger:
      "px-2 py-0 data-[hover=true]:bg-default-100 rounded-lg h-14 flex items-center",
    indicator: "font-bold text-base text-[#2f3037] flex items-center text-xl",
    content: "text-medium",
  };

  const contentMarkdownStyle = {
    fontSize: "1.5rem",
    lineHeight: "2rem",
  };

  const ids = answers.data.map((answer: any) => answer.id.toString());

  return (
    <Accordion
      variant="splitted"
      className="w-full gap-4 mx-auto"
      itemClasses={itemClasses}
      defaultExpandedKeys={ids}
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
      {answers.data.map((answer: any) => (
        <AccordionItem
          key={answer.id}
          aria-label={answer.creator_name}
          startContent={
            <Avatar
              isBordered
              color="default"
              radius="lg"
              src={answer.creator_photo ? answer.creator_photo : "/user.svg"}
              ImgComponent={answer.creator_photo ? "img" : "svg"}
              imgProps={{ referrerPolicy: "no-referrer" }}
            />
          }
          title={
            <MarkdownRender
              content={`${answer.creator_name}`}
              style={contentMarkdownStyle}
            />
          }
          subtitle={<Subtitle answer={answer} />}
        >
          <div className="flex flex-col gap-4 ml-[64px] mr-10 justify-between mb-6">
            <div className="flex-grow">
              <MarkdownRender
                content={answer.content}
                style={{ fontSize: "1.25rem", lineHeight: "2rem" }}
              />
            </div>
            {answer.image_url && (
              <Image
                removeWrapper
                className={"w-[80%] self-center"}
                src={answer.image_url}
                alt="answer image"
              />
            )}
          </div>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
