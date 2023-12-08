'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { Input } from '@nextui-org/react';
import SearchIcon from '@/components/Filter/SearchIcon';
import CustomSelect from '@/components/CustomSelect';
import CustomTable from '@/components/CustomTable';

// const data = [
//   {
//     "id": 17,
//     "type": "期中",
//     "teacher": "黃宜侯",
//     "year": 111,
//     "rating_id": null,
//     "main_file": "https://ade-stylish.s3.ap-northeast-1.amazonaws.com/gpass/exams/Midterm%201.pdf",
//     "ans_file": "https://ade-stylish.s3.ap-northeast-1.amazonaws.com/gpass/exams/Midterm%201%20%28answers%29.pdf",
//     "sheet_files": null,
//     "has_ans": 1,
//     "class_id": 10,
//     "class": "總體經濟學"
//   },
//   {
//     "id": 18,
//     "type": "期中",
//     "teacher": "黃宜侯",
//     "year": 111,
//     "rating_id": null,
//     "main_file": "https://ade-stylish.s3.ap-northeast-1.amazonaws.com/gpass/exams/Midterm%202.pdf",
//     "ans_file": "https://ade-stylish.s3.ap-northeast-1.amazonaws.com/gpass/exams/Midterm%202%20%28answers%29.pdf",
//     "sheet_files": null,
//     "has_ans": 1,
//     "class_id": 10,
//     "class": "總體經濟學"
//   },
//   {
//     "id": 18,
//     "type": "期中",
//     "teacher": "黃宜侯",
//     "year": 111,
//     "rating_id": null,
//     "main_file": "https://ade-stylish.s3.ap-northeast-1.amazonaws.com/gpass/exams/Midterm%202.pdf",
//     "ans_file": "https://ade-stylish.s3.ap-northeast-1.amazonaws.com/gpass/exams/Midterm%202%20%28answers%29.pdf",
//     "sheet_files": null,
//     "has_ans": 1,
//     "class_id": 10,
//     "class": "總體經濟學"
//   }
// ]

export default function Wrapper({
  searchParams,
  data,
}: {
  searchParams: any;
  data: any;
}) {
  const [inputValue, setInputValue] = useState(searchParams.classid ?? '');
  const router = useRouter();
  const pathname = usePathname();
  const [exams, setExams] = useState(data);
  console.log(exams);
  const [type, setType] = useState({
    label: 'Type',
    values: ['All', '期中', '期末', '小考', '其他'],
    value: searchParams.Type ?? 'All',
  });
  const [year, setYear] = useState({
    label: 'Year',
    values: ['All', '110', '109', '108', '107'],
    value: searchParams.Year ?? 'All',
  });
  const [teacher, setTeacher] = useState({
    label: 'Teacher',
    values: ['All', '黃宜侯', '黃宜侯', '黃宜侯', '黃宜侯'],
    value: searchParams.Teacher ?? 'All',
  });
  const [date, setDate] = useState({
    label: 'Date',
    values: ['All', 'Today', 'Last Week', 'Last 2 Weeks', 'Last Month'],
    value: searchParams.Date ?? 'Today',
  });

  return (
    <div className="flex w-full flex-col gap-5">
      <div className="flex h-12 gap-5">
        <Input
          aria-label="Employee ID input"
          isClearable
          variant="bordered"
          value={inputValue}
          startContent={<SearchIcon />}
          radius="sm"
          onClear={() => {
            setInputValue('');
          }}
          onValueChange={(value) => {
            setInputValue(value);
            const newSearchParams = new URLSearchParams(searchParams);
            if (value !== '') {
              newSearchParams.set('empId', value);
            } else {
              newSearchParams.delete('empId');
            }
            router.push(`${pathname}?${newSearchParams.toString()}`);
          }}
          classNames={{
            inputWrapper: 'h-full border border-[#2f3037] bg-[#f4f4f5] w-52',
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
          state={date}
          onChange={setDate}
          searchParams={searchParams}
        />
      </div>
      <CustomTable
        data={exams}
        onClickRow={setInputValue}
      />
    </div>
  );
}
