"use client";

import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import useGetExams from "@/hooks/exams/useGetExams";
import { Input } from "@nextui-org/react";
import SearchIcon from "@/components/Filter/SearchIcon";
import CustomSelect from "@/components/Class/CustomSelect";
import CustomTable from "@/components/Class/CustomTable";
import { Spinner } from "@nextui-org/react";

export default function Wrapper({
  searchParams,
  classId,
}: {
  searchParams: any;
  classId: any;
}) {
  const [inputValue, setInputValue] = useState(searchParams.className ?? "");
  const [className, setClassName] = useState(searchParams.className ?? "");
  const router = useRouter();
  const pathname = usePathname();
  // const [exams, setExams] = useState(data);
  const [type, setType] = useState({
    displayLabel: "類型",
    label: "type",
    values: ["All", "期中", "期末", "小考", "講義", "其他"],
    value: searchParams.type ?? "All",
  });
  const [year, setYear] = useState({
    displayLabel: "學年度",
    label: "year",
    values: ["All", "110", "109", "108", "107"],
    value: searchParams.year ?? "All",
  });
  const [teacher, setTeacher] = useState({
    displayLabel: "老師",
    label: "teacher",
    values: ["All", "黃宜侯", "黃宜侯", "黃宜侯", "黃宜侯"],
    value: searchParams.teacher ?? "All",
  });
  const [hasAns, setHasAns] = useState({
    displayLabel: "有無答案",
    label: "hasAns",
    values: ["All", "有", "無"],
    value: searchParams.hasAns ?? "All",
  });

  const { exams, loading } = useGetExams(
    classId,
    className,
    teacher.value,
    year.value,
    type.value,
    hasAns.value
  );
  console.log("exams", exams);

  const handleKeyDown = (event: any) => {
    // 檢查是否按下 Enter 鍵（按鍵碼為 13）
    if (event.key === 'Enter') {
      const newSearchParams = new URLSearchParams(searchParams);
      if (inputValue !== '') {
        newSearchParams.set('className', inputValue);
        setClassName(inputValue);
      } else {
        newSearchParams.delete('className');
        setClassName('');
      }
      router.push(`${pathname}?${newSearchParams.toString()}`);
    }
  };

  useEffect(() => {
    setInputValue(searchParams.className);

    if (exams?.data?.length === 0) {
      return;
    }

    // 使用 Set 來儲存不重複的值
    const uniqueTypes:Set<any> = new Set();
    const uniqueYears:Set<any> = new Set();
    const uniqueTeachers:Set<any> = new Set();

    // 使用 map 來迭代 exams 數組
    exams.forEach((exam:any) => {
      // 添加 type 到 uniqueTypes Set
      uniqueTypes.add(exam.type);
      // 添加 year 到 uniqueYears Set
      uniqueYears.add(exam.year);
      // 添加 teacher 到 uniqueTeachers Set
      uniqueTeachers.add(exam.teacher);
    });

    // 將 Set 轉換回數組
    const uniqueTypeArray = Array.from(uniqueTypes);
    const uniqueYearArray = Array.from(uniqueYears);
    const uniqueTeacherArray = Array.from(uniqueTeachers);

    setType({
      displayLabel: "類型",
      label: "type",
      values: ["All", ...uniqueTypeArray],
      value: searchParams.type ?? "All",
    });
    setYear({
      displayLabel: "學年度",
      label: "year",
      values: ["All", ...uniqueYearArray],
      value: searchParams.year ?? "All",
    });
    setTeacher({
      displayLabel: "老師",
      label: "teacher",
      values: ["All", ...uniqueTeacherArray],
      value: searchParams.teacher ?? "All",
    });
    setHasAns({
      displayLabel: "有無答案",
      label: "hasAns",
      values: ["All", "有", "無"],
      value: searchParams.hasAns ?? "All",
    });
  }, [searchParams, exams]);

  return (
    <div className="flex w-full flex-col gap-5">
      <div className="flex h-12 gap-5">
        <Input
          aria-label="Class"
          isClearable
          variant="bordered"
          value={inputValue}
          startContent={<SearchIcon />}
          radius="sm"
          onClear={() => {
            setInputValue("");
            setClassName("");
            const newSearchParams = new URLSearchParams(searchParams);
            newSearchParams.delete("className");
            router.push(`${pathname}?${newSearchParams.toString()}`);
          }}
          onValueChange={(value) => {
            setInputValue(value);
          }}
          onKeyDown={handleKeyDown}
          classNames={{
            inputWrapper: "h-full border border-[#2f3037] bg-[#f4f4f5] w-52",
          }}
        />

        <CustomSelect
          state={type}
          onChange={setType}
          searchParams={searchParams}
        />
        <CustomSelect
          state={year}
          onChange={setYear}
          searchParams={searchParams}
        />
        <CustomSelect
          state={teacher}
          onChange={setTeacher}
          searchParams={searchParams}
        />
        <CustomSelect
          state={hasAns}
          onChange={setHasAns}
          searchParams={searchParams}
        />
      </div>
      {loading && (
        <div className="flex w-full justify-center">
          <Spinner color="primary" />
        </div>
      )}
      {(exams.length === 0 || exams?.data?.length === 0) && !loading && (
        <div className="flex w-full justify-center">No data</div>
      )}
      {exams.length !== 0 && exams?.data?.length !== 0 && !loading && (
        <CustomTable data={exams} onClickRow={setInputValue} />
      )}
    </div>
  );
}
