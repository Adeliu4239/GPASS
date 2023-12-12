"use client";

import React, { useState } from "react";
import Swal from "sweetalert2";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Chip,
  useDisclosure,
  Checkbox,
  Input,
  Link,
} from "@nextui-org/react";
import useCreateExercise from "@/hooks/useCreateExercise";

export default function ExamDetailSection({
  examDetails,
}: {
  examDetails: any;
}) {
  const [question, setQuestion] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [hideName, setHideName] = useState<boolean>(false);
  const [selectFiles, setSelectFiles] = useState<File[] | null>(null);
  const filesInputRef = React.useRef<HTMLInputElement>(null);

  const { uploadData } = useCreateExercise();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    console.log("files", files);
    if (files) {
      setSelectFiles(Array.from(files));
    }
  };

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  
  const handleSubmit = async () => {
    if (question) {
      let uploadProps = {
        question,
        content,
        exercise_files: selectFiles,
        hideName: hideName,
      };
      console.log("uploadProps", uploadProps);
      try {
        await uploadData(uploadProps, examDetails.id);
        setQuestion("");
        setContent("");
        setHideName(false);
        setSelectFiles(null);
      } catch (e) {
        console.error(e);
        Swal.fire({
          icon: 'error',
          title: 'Upload failed',
          text: 'An error occurred while uploading your question.',
        });
      }
    } else {
      // 顯示警告的 SweetAlert
      Swal.fire({
        icon: 'warning',
        title: 'Missing question',
        text: 'Please enter a question before submitting.',
      });
    }
  };

  return (
    <div className="flex flex-col p-8 border border-[#2f3037] rounded-xl bg-[#fcfcfc] w-full mx-auto min-h-[240px] justify-between gap-8">
      <div className="flex items-end justify-between">
        <div className="color-[#2f3037] font-bold text-5xl">
          {`${decodeURIComponent(
            examDetails.main_file.replace(/^.*[\\\/]/, "").replace(/\..+$/, "")
          )} `}
        </div>
      </div>
      <div className="flex flex-row-reverse color-[#2f3037] font-bold text-2xl gap-2">
        <Chip
          color={`${examDetails.has_ans === 1 ? "success" : "warning"}`}
          size="lg"
          variant="flat"
        >
          {examDetails.has_ans === 1 ? "有" : "無"}答案
        </Chip>
        {`${examDetails.class} - ${examDetails.teacher} - ${examDetails.type} - ${examDetails.year} 學年度`}
      </div>
      <div className="flex items-end justify-between">
        <div className="flex items-end justify-between gap-6">
          <Button
            color="success"
            variant="bordered"
            href={examDetails.main_file}
            as={Link}
            endContent={
              <svg
                width="24px"
                height="24px"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                <g
                  id="SVGRepo_tracerCarrier"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                ></g>
                <g id="SVGRepo_iconCarrier">
                  {" "}
                  <path
                    d="M8 22.0002H16C18.8284 22.0002 20.2426 22.0002 21.1213 21.1215C22 20.2429 22 18.8286 22 16.0002V15.0002C22 12.1718 22 10.7576 21.1213 9.8789C20.3529 9.11051 19.175 9.01406 17 9.00195M7 9.00195C4.82497 9.01406 3.64706 9.11051 2.87868 9.87889C2 10.7576 2 12.1718 2 15.0002L2 16.0002C2 18.8286 2 20.2429 2.87868 21.1215C3.17848 21.4213 3.54062 21.6188 4 21.749"
                    stroke="#18c964"
                    stroke-width="1.5"
                    stroke-linecap="round"
                  ></path>{" "}
                  <path
                    d="M12 2L12 15M12 15L9 11.5M12 15L15 11.5"
                    stroke="#18c964"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  ></path>{" "}
                </g>
              </svg>
            }
          >
            下載檔案
          </Button>
          {examDetails.has_ans == 1 && examDetails.ans_file && (
            <Button
              color="danger"
              variant="bordered"
              href={examDetails.ans_file}
              as={Link}
              endContent={
                <svg
                  width="24px"
                  height="24px"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                  <g
                    id="SVGRepo_tracerCarrier"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  ></g>
                  <g id="SVGRepo_iconCarrier">
                    {" "}
                    <path
                      d="M8 22.0002H16C18.8284 22.0002 20.2426 22.0002 21.1213 21.1215C22 20.2429 22 18.8286 22 16.0002V15.0002C22 12.1718 22 10.7576 21.1213 9.8789C20.3529 9.11051 19.175 9.01406 17 9.00195M7 9.00195C4.82497 9.01406 3.64706 9.11051 2.87868 9.87889C2 10.7576 2 12.1718 2 15.0002L2 16.0002C2 18.8286 2 20.2429 2.87868 21.1215C3.17848 21.4213 3.54062 21.6188 4 21.749"
                      stroke="#f31260"
                      stroke-width="1.5"
                      stroke-linecap="round"
                    ></path>{" "}
                    <path
                      d="M12 2L12 15M12 15L9 11.5M12 15L15 11.5"
                      stroke="#f31260"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    ></path>{" "}
                  </g>
                </svg>
              }
            >
              下載答案
            </Button>
          )}
        </div>
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
                  Create Exercise
                </ModalHeader>
                <ModalBody>
                  <Input
                    autoFocus
                    required
                    label="Question"
                    placeholder="Enter your question"
                    variant="bordered"
                    onChange={(e) => setQuestion(e.target.value)}
                  />
                  <Input
                    label="Content"
                    placeholder="Enter your content"
                    variant="bordered"
                    onChange={(e) => setContent(e.target.value)}
                  />
                  {!selectFiles && (
                    <>
                      <Button
                        color="default"
                        variant="faded"
                        onClick={() => {
                          if (filesInputRef.current) {
                            filesInputRef.current.click();
                          }
                          console.log("click upload file");
                        }}
                      >
                        Upload Files
                      </Button>
                      <input
                        type="file"
                        multiple
                        ref={filesInputRef}
                        style={{ display: "none" }}
                        onChange={(e) => handleFileChange(e)}
                      />
                    </>
                  )}
                  {selectFiles && (
                    <div className="flex flex-col gap-2">
                      {selectFiles.map((file) => (
                        // eslint-disable-next-line react/jsx-key
                        <div className="flex flex-row gap-2">
                          <div className="flex items-center justify-center w-8 h-8 bg-[#2f3037] rounded-full text-white">
                            {file.name}
                          </div>
                        </div>
                      ))}
                      <Button
                        color="danger"
                        variant="light"
                        className="mr-2"
                        radius="full"
                        onClick={() => setSelectFiles(null)}
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
                    Create
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
