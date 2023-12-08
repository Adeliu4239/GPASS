import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";

interface ClassItem {
  id: number;
  name: string;
  grade: string;
}

export default function Sidebar({
  show,
  setter,
  data,
}: {
  show: boolean;
  setter: any;
  data: any;
}) {
  // Define our base class
  const className =
    "bg-[#444] w-[250px] transition-[margin-left] ease-in-out duration-500 fixed md:static top-0 bottom-0 left-0 z-40";
  // Append class based on state of sidebar visiblity
  const appendClass = show ? " ml-0" : " ml-[-250px] md:ml-0";
  const [sortedClasses, setSortedClasses] = useState([]);
  // Clickable menu items
  const MenuItem = ({ name, route }: { name: string; route: string }) => {
    // Highlight menu item based on currently displayed route
    const pathname = usePathname();
    const colorClass =
      pathname == `/class/${route}` ? "text-white" : "text-white/50 hover:text-white";
    return (
      <Link
        href={route}
        onClick={() => {
          setter((oldVal: any) => !oldVal);
        }}
        className={`flex gap-1 [&>*]:my-auto text-md pl-6 py-3 border-b-[1px] border-b-white/10 ${colorClass}`}
      >
        <div>{name}</div>
      </Link>
    );
  };

  // Overlay to prevent clicks in background, also serves as our close button
  const ModalOverlay = () => (
    <div
      className={`flex md:hidden fixed top-0 right-0 bottom-0 left-0 bg-black/50 z-30 min-h-screen`}
      onClick={() => {
        setter((oldVal: any) => !oldVal);
      }}
    />
  );

  console.log(data);

  useEffect(() => {
    const classes = data? data.classes : [];
    // 將數據按照 grade 分類
    const groupedClasses = classes.reduce(
      (acc: any, currentClass: ClassItem) => {
        const { grade } = currentClass;
        if (!acc[grade]) {
          acc[grade] = [];
        }
        acc[grade].push(currentClass);
        return acc;
      },
      {}
    );

    // 確保 GradeOrder 是一個字符串數組
    const gradeOrder: string[] = ["大一", "大二", "大三", "選修", "其他"];

    const sortedClasses = gradeOrder.reduce((acc: any, grade) => {
      if (groupedClasses[grade]) {
        acc.push(...groupedClasses[grade]);
      }
      return acc;
    }, []);
    setSortedClasses(sortedClasses);
  }, [data]);
  return (
    <>
      <div className={`${className}${appendClass}`}>
        <div className="p-2 flex">
          <Link href="/">
            {/*eslint-disable-next-line*/}
            <Image
              src="/gpass-logo.png"
              alt="GPASS Logo"
              width={300}
              height={300}
              className="cursor-pointer"
            />
          </Link>
        </div>
        <div className="flex flex-col">
          {data ? (
            sortedClasses.map((item: any) => (
              <MenuItem name={item.name} route={item.id.toString()} key={item.id} />
            ))
          ) : (
            <></>
          )}
        </div>
      </div>
      {show ? <ModalOverlay /> : <></>}
    </>
  );
}
