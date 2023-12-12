"use client";

import React, { useState, useRef } from "react";
import { Image, Input, Select, SelectItem, Button } from "@nextui-org/react";
import Sidebar from "@/components/sideBar";

import useUploadData from "@/hooks/useUploadData";

export default function UploadPage() {
  const [className, setClassName] = useState<string>("");
  const [teacher, setTeacher] = useState<string>();
  const [grade, setGrade] = useState<string>();
  const [hasAns, setHasAns] = useState<string>();
  const [type, setType] = useState<string>();
  const [year, setYear] = useState<any>();

  const [selectFile, setSelectFile] = useState<File | null>(null);
  const [selectAnsFile, setSelectAnsFile] = useState<File | null>(null);
  const [showSidebar, setShowSidebar] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const ansFileInputRef = useRef<HTMLInputElement>(null);
  const { isLoading, response, error, uploadData } = useUploadData();

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    type: string
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      if (type === "mainFile") {
        console.log("file", file);
        setSelectFile(file);
      } else if (type === "ansFile") {
        console.log("ansfile", file);
        setSelectAnsFile(file);
      }
    }
  };

  const handleSubmit = async () => {
    if (className && teacher && grade && hasAns && type && year && selectFile) {
      if (typeof type === "string") {
        const uploadProps = {
          className,
          teacher,
          grade,
          hasAns,
          type,
          year,
          mainFile: selectFile!,
          ansFile: selectAnsFile ?? null,
        };
        await uploadData(uploadProps);
      } else {
        console.error("type is not a valid string");
      }
    } else {
      console.error("Some fields are missing");
    }
  };

  const GradeSelect = [
    { label: "大一", value: "大一" },
    { label: "大二", value: "大二" },
    { label: "大三", value: "大三" },
    { label: "選修", value: "選修" },
    { label: "其他", value: "其他" },
  ];

  const hasAnsSelect = [
    { label: "有", value: 1 },
    { label: "無", value: 0 },
  ];

  const typeSelect = [
    { label: "期中", value: "期中" },
    { label: "期末", value: "期末" },
    { label: "小考", value: "小考" },
    { label: "講義", value: "講義" },
    { label: "其他", value: "其他" },
  ];

  return (
    <div className="flex bg-gray-200 min-h-screen">
      <Sidebar show={showSidebar} setter={setShowSidebar} />
      <main className="flex w-[100%] min-h-screen flex-col items-center justify-evenly p-12">
        <div className="flex justify-center items-center w-full">
          <h1 className="text-4xl font-bold text-gray-800">GPASS 上傳區</h1>
        </div>
        <div className="flex w-[50%] flex-col items-center justify-evenly  border border-[#30303E] rounded-2xl py-4">
          <div className="flex flex-wrap w-[90%] justify-between">
            <div className="w-1/2 p-2">
              <Input
                variant="faded"
                label="課堂名稱"
                value={className}
                onChange={(e) => setClassName(e.target.value)}
              />
            </div>
            <div className="w-1/2 p-2">
              <Select
                label="選別"
                variant="faded"
                value={grade}
                onChange={(event) => setGrade(event.target.value)}
              >
                {GradeSelect.map((dept) => (
                  <SelectItem key={dept.value} value={dept.value}>
                    {dept.label}
                  </SelectItem>
                ))}
              </Select>
            </div>
            <div className="w-1/2 p-2">
              <Input
                variant="faded"
                label="學年度"
                value={year}
                onChange={(e) => setYear(e.target.value)}
              />
            </div>
            <div className="w-1/2 p-2">
              <Select
                label="類別"
                variant="faded"
                value={type}
                onChange={(event) => setType(event.target.value)}
              >
                {typeSelect.map((dt) => (
                  <SelectItem key={dt.value} value={dt.value}>
                    {dt.label}
                  </SelectItem>
                ))}
              </Select>
            </div>
            <div className="w-1/2 p-2">
              <Input
                label="老師"
                variant="faded"
                value={teacher}
                onChange={(event) => {
                  setTeacher(event.target.value);
                }}
              />
            </div>
            <div className="w-1/2 p-2">
              <Select
                label="有無答案"
                variant="faded"
                value={hasAns}
                onChange={(event) => setHasAns(event.target.value)}
              >
                {hasAnsSelect.map((z) => (
                  <SelectItem key={z.value} value={z.value}>
                    {z.label}
                  </SelectItem>
                ))}
              </Select>
            </div>
          </div>
          <div className="flex w-[90%] justify-between p-2">
            <div className="flex w-[50%] justify-between flex-wrap">
              <div>
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
                      Upload File
                    </Button>
                    <input
                      type="file"
                      ref={fileInputRef}
                      style={{ display: "none" }}
                      onChange={(e) => handleFileChange(e, "mainFile")}
                    />
                  </>
                )}
                {selectFile && (
                  <div className="flex justify-between items-center">
                    <Button
                      color="danger"
                      variant="light"
                      className="mr-2"
                      radius="full"
                      onClick={() => setSelectFile(null)}
                    >
                      X
                    </Button>
                    <h1 className="text-gray-800 text-sm">{`File: ${selectFile.name}`}</h1>
                  </div>
                )}
              </div>
              <div>
                {!selectAnsFile && (
                  <>
                    <Button
                      color="default"
                      variant="faded"
                      onClick={() => {
                        if (ansFileInputRef.current) {
                          ansFileInputRef.current.click();
                        }
                        console.log("click upload ans file");
                      }}
                    >
                      Upload Answer
                    </Button>
                    <input
                      type="file"
                      ref={ansFileInputRef}
                      style={{ display: "none" }}
                      onChange={(e) => handleFileChange(e, "ansFile")}
                    />
                  </>
                )}
                {selectAnsFile && (
                  <div className="flex justify-evenly items-center">
                    <Button
                      color="danger"
                      variant="light"
                      className="mr-2"
                      radius="full"
                      onClick={() => setSelectAnsFile(null)}
                    >
                      X
                    </Button>
                    <h1 className="text-gray-800 text-sm">
                      {`AnsFile: ${selectAnsFile.name}`}
                    </h1>
                  </div>
                )}
              </div>
            </div>
            <Button color="default" variant="faded" onClick={handleSubmit}>
              Post
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
