"use client";

import React, { useState } from "react";
import transformDate from "@/utils/transformDate";
import Swal from "sweetalert2";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Avatar,
  Accordion,
  AccordionItem,
  Button,
  Chip,
  useDisclosure,
  Checkbox,
  Input,
  Link,
  Image,
} from "@nextui-org/react";
import MarkdownRender from "@components/MarkdownRender";
import useCreateAnswer from "@/hooks/useCreateAnswer";

export default function ExerciseDetailsSection({
  examDetails,
  exerciseDetails,
}: {
  examDetails: any;
  exerciseDetails: any;
}) {
  const [content, setContent] = useState<string>("");
  const [hideName, setHideName] = useState<boolean>(false);
  const [selectFile, setSelectFile] = useState<File | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const { uploadData } = useCreateAnswer();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectFile(file);
    }
  };

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const handleSubmit = async () => {
    if (content) {
      let uploadProps = {
        content,
        image_url: selectFile,
        hideName: hideName,
      };
      try {
        await uploadData(uploadProps, exerciseDetails.id);
        setContent("");
        setHideName(false);
        setSelectFile(null);
      } catch (e) {
        console.error(e);
        Swal.fire({
          icon: "error",
          title: "Upload failed",
          text: "An error occurred while uploading your question.",
        });
      }
    } else {
      // 顯示警告的 SweetAlert
      Swal.fire({
        icon: "warning",
        title: "Missing question",
        text: "Please enter a question before submitting.",
      });
    }
  };

  const mainTitleStyle = {
    fontSize: "3rem",
    lineHeight: "4rem",
  };

  const contentStyle = {
    fontSize: "1.5rem",
    lineHeight: "2rem",
  };

  const Subtitle = ({ exercise }: { exercise: any }) => {
    const date = transformDate(exercise.created_at);
    let subtitle = `Created at ${date}`;
    if (exercise.updated_at) {
      subtitle = subtitle.concat(
        ` - Updated at ${transformDate(exercise.updated_at)}`
      );
    }
    return <div className="text-sm text-[#888]">{subtitle}</div>;
  };

  const examName = decodeURIComponent(
    examDetails.main_file.replace(/^.*[\\\/]/, "").replace(/\..+$/, "")
  );

  console.log(exerciseDetails.images);
  return (
    <div className="flex flex-col p-8 gap-3 border border-[#2f3037] rounded-xl bg-[#fcfcfc] w-full mx-auto min-h-[240px] justify-between">
      <div className="flex items-end justify-between">
        <div className="color-[#2f3037] font-bold text-5xl">
          <MarkdownRender
            content={exerciseDetails.question}
            style={mainTitleStyle}
          />
        </div>
      </div>
      <div className="flex items-end justify-between">
        <div className="flex my-2 items-center gap-3">
          <Avatar
            isBordered
            color="default"
            radius="lg"
            src={
              exerciseDetails.creator_photo
                ? exerciseDetails.creator_photo
                : "/user.svg"
            }
            imgProps={{ referrerPolicy: "no-referrer" }}
          />
          <div className="flex flex-col">
            <div className="color-[#2f3037] font-bold text-2xl">
              {exerciseDetails.creator_name}
            </div>
            <div className="color-[#2f3037] text-sm">
              <Subtitle exercise={exerciseDetails} />
            </div>
          </div>
        </div>
        <div className="flex color-[#2f3037] font-bold text-2xl gap-2">
          {`${examDetails.class} - ${examDetails.teacher} - ${examDetails.type} - ${examDetails.year} 學年度 - ${examName}`}
        </div>
      </div>
      <div className="ml-[56px]">
        <MarkdownRender
          content={
            exerciseDetails.content ? exerciseDetails.content : "沒有題目內容"
          }
          style={contentStyle}
        />
      </div>
      {exerciseDetails.images && exerciseDetails.images.length > 0 && (
        <div className="flex flex-col w-[60%] max-h-[50vh] overflow-y-scroll self-center gap-4">
          {exerciseDetails.images.map((image: any) => (
            // eslint-disable-next-line react/jsx-key
            <Image
              removeWrapper
              className={"w-full self-center"}
              src={image.image_url}
              alt="Exercise image"
            />
          ))}
        </div>
      )}
      <div className="flex flex-row-reverse">
        <Button
          color="warning"
          variant="bordered"
          onClick={onOpen}
          endContent={
            <svg
              fill="#f5a524"
              version="1.1"
              id="Capa_1"
              xmlns="http://www.w3.org/2000/svg"
              xmlnsXlink="http://www.w3.org/1999/xlink"
              width="24px"
              height="24px"
              viewBox="0 0 82.796 82.796"
              xmlSpace="preserve"
            >
              <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
              <g
                id="SVGRepo_tracerCarrier"
                stroke-linecap="round"
                stroke-linejoin="round"
              ></g>
              <g id="SVGRepo_iconCarrier">
                {" "}
                <g>
                  {" "}
                  <path d="M41.399,0C18.85,0,0.506,14.084,0.506,31.396c0,13.068,10.471,24.688,26.232,29.314c-0.316,4.892-1.662,9.507-4.01,13.747 c-1.92,3.466-2.352,5.477-1.488,6.938c0.523,0.892,1.475,1.401,2.609,1.401c0.004,0,0.008,0,0.012,0 c1.508,0,5.52-0.051,30.909-21.728c16.481-4.36,27.521-16.237,27.521-29.673C82.292,14.084,63.945,0,41.399,0z M53.295,57.221 l-0.463,0.117l-0.363,0.311c-17.201,14.707-24.262,19.146-27.018,20.48c0.201-0.445,0.479-1.002,0.859-1.689 c2.926-5.283,4.471-11.082,4.588-17.231l0.031-1.618l-1.568-0.402C14.55,53.369,4.599,43.003,4.599,31.396 c0-15.053,16.508-27.301,36.799-27.301c20.29,0,36.797,12.248,36.797,27.301C78.195,43.053,68.189,53.432,53.295,57.221z M44.469,12.298c0.246,0.252,0.379,0.592,0.369,0.943l-0.859,26.972c-0.018,0.707-0.598,1.271-1.305,1.271h-2.551 c-0.709,0-1.287-0.563-1.305-1.271l-0.859-26.972c-0.01-0.352,0.123-0.691,0.369-0.943c0.246-0.251,0.582-0.394,0.934-0.394h4.273 C43.887,11.905,44.223,12.047,44.469,12.298z M44.783,47.312v4.885c0,0.72-0.584,1.304-1.305,1.304h-4.16 c-0.721,0-1.305-0.584-1.305-1.304v-4.885c0-0.72,0.584-1.304,1.305-1.304h4.16C44.199,46.009,44.783,46.593,44.783,47.312z"></path>{" "}
                </g>{" "}
              </g>
            </svg>
          }
        >
          發起問題
        </Button>
        <Modal
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          placement="top-center"
          backdrop="blur"
        >
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  Create Answer
                </ModalHeader>
                <ModalBody>
                  <Input
                    autoFocus
                    label="Content"
                    placeholder="Enter your response"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                  />
                  {!selectFile && (
                    <>
                      <Button
                        color="default"
                        variant="faded"
                        onClick={() => {
                          if (fileInputRef.current) {
                            fileInputRef.current.click();
                          }
                          console.log("click upload file");
                        }}
                      >
                        Upload Files
                      </Button>
                      <input
                        type="file"
                        ref={fileInputRef}
                        style={{ display: "none" }}
                        onChange={(e) => handleFileChange(e)}
                      />
                    </>
                  )}
                  {selectFile && (
                    <div className="flex flex-col gap-2">
                      <div className="flex flex-row gap-2">
                        <Chip
                          color="default"
                          variant="flat"
                          onClose={() => setSelectFile(null)}
                        >
                          {selectFile.name}
                        </Chip>
                        <Link
                          color="primary"
                          href={URL.createObjectURL(selectFile)}
                          target="_blank"
                        >
                          Preview
                        </Link>
                      </div>
                      <Button
                        color="danger"
                        variant="light"
                        className="mr-2"
                        radius="full"
                        onClick={() => setSelectFile(null)}
                      >
                        X
                      </Button>
                    </div>
                  )}

                  <div className="flex py-2 px-1 justify-between">
                    <Checkbox
                      classNames={{
                        label: "text-small",
                      }}
                      onChange={() => setHideName(!hideName)}
                    >
                      <span>Anonymous</span>
                    </Checkbox>
                  </div>
                </ModalBody>
                <ModalFooter>
                  <Button color="danger" variant="flat" onPress={onClose}>
                    Close
                  </Button>
                  <Button
                    color="primary"
                    onPress={() => {
                      handleSubmit();
                      onClose();
                    }}
                  >
                    Create Answer
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      </div>
    </div>
  );
}
