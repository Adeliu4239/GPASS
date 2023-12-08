import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import useSWR from "@/hooks/useSWR";
import axios from "axios";
import getCookies from "@/utils/getCookies";
import useLogout from "@/hooks/useLogout";
interface ClassItem {
  id: number;
  name: string;
  grade: string;
}

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

export default function Sidebar({
  show,
  setter,
}: {
  show: boolean;
  setter: any;
}) {
  const { data, error } = useSWR(`${process.env.NEXT_PUBLIC_API_URL}/classes`);
  // const { data, error } = useSWR(
  //   `${process.env.NEXT_PUBLIC_API_URL}/classes`,
  //   fetcher
  // );
  const [sortedClasses, setSortedClasses] = useState([]);
  const [name, setName] = useState("");
  const [photo, setPhoto] = useState("");

  const { handleLogout } = useLogout();

  const gradeOrder: string[] = ["大一", "大二", "大三", "選修", "其他"];
  // Define our base class
  const className =
    "bg-[#444] w-[250px] transition-[margin-left] ease-in-out duration-500 fixed md:static top-0 bottom-0 left-0 z-40 flex flex-col";
  // Append class based on state of sidebar visiblity
  const appendClass = show ? " ml-0" : " ml-[-250px] md:ml-0";
  // Clickable menu items
  const MenuItem = ({ name, route }: { name: string; route: string }) => {
    // Highlight menu item based on currently displayed route
    const pathname = usePathname();
    const colorClass =
      pathname == `/class/${route}` ||
      (pathname == "/upload" && route == "/upload")
        ? "text-white"
        : "text-white/50 hover:text-white";
    return (
      <Link
        href={route == "/upload" ? route : `/class/${route}`}
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
    const classes = data ? (data as any).classes : [];
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

    const sortedClasses = gradeOrder.reduce((acc: any, grade) => {
      if (groupedClasses[grade]) {
        acc.push(...groupedClasses[grade]);
      }
      return acc;
    }, []);
    setSortedClasses(sortedClasses);
    const { userName, userPhoto } = getCookies();
    setName(userName);
    setPhoto(userPhoto);
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
        <div className="flex flex-col flex-grow">
          {data ? (
            sortedClasses.map((item: any) => (
              <MenuItem
                name={item.name}
                route={item.id.toString()}
                key={item.id}
              />
            ))
          ) : (
            <></>
          )}
        </div>
        <div className="flex flex-col">
          <MenuItem name={"上傳考古題"} route={"/upload"} key={"upload"} />
          <div className="flex  [&>*]:my-auto text-md px-6 py-3 border-b-[1px] border-b-white/10 text-white items-center justify-between">
            <Image
              src={photo ? photo : "/user.svg"}
              alt="User Photo"
              width={32}
              height={32}
              className="rounded-full"
            />
            {name ? name : "Unknown User"}
            <Image
              src="/logout.svg"
              alt="Logout"
              width={24}
              height={24}
              className="cursor-pointer"
              onClick={() => {
                handleLogout();
              }}
            />
          </div>
        </div>
      </div>
      {show ? <ModalOverlay /> : <></>}
    </>
  );
}
