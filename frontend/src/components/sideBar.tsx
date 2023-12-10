import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Avatar, Image } from "@nextui-org/react";
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

  const [expandedGrade, setExpandedGrade] = useState<string | null>(null);

  const handleGradeClick = (grade: string) => {
    // 如果已經展開，則收起；如果未展開，則展開
    setExpandedGrade((prevGrade) => (prevGrade === grade ? null : grade));
  };

  const pathname = usePathname();
  const route = pathname.split("/")[2];
  const { handleLogout } = useLogout();

  const gradeOrder: string[] = ["大一", "大二", "大三", "選修", "其他"];
  // Define our base class
  const className =
    "bg-[#444] w-[250px] transition-[margin-left] ease-in-out duration-500 fixed md:static top-0 bottom-0 left-0 z-40 flex flex-col max-h-screen";
  // Append class based on state of sidebar visiblity
  const appendClass = show ? " ml-0" : " ml-[-250px] md:ml-0";
  // Clickable menu items
  const MenuItem = ({ name, route }: { name: string; route: string }) => {
    // Highlight menu item based on currently displayed route
    const pathname = usePathname();
    const colorClass =
      pathname.split("/")[2] == `${route}` ||
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
        const { grade, id} = currentClass;
        if(id.toString() == route){
          setExpandedGrade(grade);
        }
        if (!acc[grade]) {
          acc[grade] = [];
        }
        acc[grade].push(currentClass);
        return acc;
      },
      {}
    );
    console.log("path", pathname);
    // const sortedClasses = gradeOrder.reduce((acc: any, grade) => {
    //   if (groupedClasses[grade]) {
    //     acc.push(...groupedClasses[grade]);
    //   }
    //   return acc;
    // }, []);
    const sortedClasses = gradeOrder.reduce((acc: any, grade) => {
      if (groupedClasses[grade]) {
        acc.push({
          grade,
          classes: groupedClasses[grade],
        });
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
            <Image
              src="/gpass-logo.png"
              alt="GPASS Logo"
              width={300}
              height={300}
              className="cursor-pointer"
            />
          </Link>
        </div>
        <div className="flex flex-col flex-grow max-h-[calc(100vh-144px)] overflow-y-auto">
          {data ? (
            sortedClasses.map((group: any) => (
              <div key={group.grade}>
                <div
                  className={`text-white text-lg font-bold px-6 py-2 cursor-pointer`}
                  onClick={() => handleGradeClick(group.grade)}
                  // onMouseEnter={() => handleGradeClick(group.grade)}
                  // onMouseLeave={() => handleGradeClick(group.grade)}
                >
                  {group.grade}
                  {expandedGrade === group.grade ? (
                    <span className="float-right">-</span>
                  ) : (
                    <span className="float-right">+</span>
                  )}
                </div>
                {expandedGrade === group.grade &&
                  group.classes.map((item: any) => (
                    <MenuItem
                      name={item.name}
                      route={item.id.toString()}
                      key={item.id}
                    />
                  ))}
              </div>
            ))
          ) : (
            <></>
          )}
        </div>
        <div className="flex flex-col h-[fit-content] mt-2">
          <MenuItem name={"上傳考古題"} route={"/upload"} key={"upload"} />
          <div className="flex  [&>*]:my-auto text-md px-6 py-3 border-b-[1px] border-b-white/10 text-white items-center justify-between">
            <Avatar
              src={photo}
              size="md"
              className="rounded-full"
              showFallback
              name={name ? name : "Unknown User"}
              isBordered
              color="default"
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
