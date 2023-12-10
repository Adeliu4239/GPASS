import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Modal,
  ModalContent,
  useDisclosure,
  ModalHeader,
  ModalBody,
  Image,
  ModalFooter,
  Spinner,
  Chip,
  ChipProps,
} from "@nextui-org/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const statusColorMap: Record<string, ChipProps["color"]> = {
  1: "success",
  0: "warning",
};

export default function CustomTable({
  data,
  onClickRow,
}: // hasMore,
// scrollerRef,
// loaderRef,
{
  data: any[];
  onClickRow: any;
  // hasMore: any;
  // scrollerRef: any;
  // loaderRef: any;
}) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [image, setImage] = useState("");
  const pathname = usePathname();

  return (
    <>
      {/* <Modal
        isOpen={isOpen}
        onClose={onClose}
        size="lg"
        backdrop="blur"
        className="bg-primary"
      >
        <ModalContent>
          <ModalHeader className="mx-auto">{dict.preview.header}</ModalHeader>
          <ModalBody className="min-h-unit-20">
            <Image
              alt="x ray image"
              src={`http://127.0.0.1:3000/${image}`}
            />
          </ModalBody>
          <ModalFooter className="flex flex-wrap justify-center gap-3">
          </ModalFooter>
        </ModalContent>
      </Modal> */}
      <Table
        aria-label="Table with exams data"
        isHeaderSticky
        classNames={{
          wrapper:
            "w-full table-fixed max-h-[38.5rem] border-none rounded-md p-0 mb-5 text-black bg-transparent",
          th: "text-base pt-3 pb-3",
          td: "text-base  pt-3 pb-3",
          tr: "hover:bg-[#1f212d] hover:text-white transition-all",
        }}
        // baseRef={scrollerRef}
        // bottomContent={
        //   hasMore ? (
        //     <div className="flex w-full justify-center">
        //       <Spinner ref={loaderRef} color="white" />
        //     </div>
        //   ) : null
        // }
      >
        <TableHeader>
          <TableColumn className="w-[20%]">科目</TableColumn>
          <TableColumn className="w-[15%]">教師</TableColumn>
          <TableColumn className="w-[10%]">學年</TableColumn>
          <TableColumn className="w-[10%]">類別</TableColumn>
          <TableColumn className="w-[10%]">答案</TableColumn>
          <TableColumn className="w-full">檔案</TableColumn>
          <TableColumn className="w-[1%]">{""}</TableColumn>
        </TableHeader>
        <TableBody>
          {data &&
            data.map((d) => (
              <TableRow key={d.id}>
                <TableCell>{d.class}</TableCell>
                <TableCell
                  onClick={() => onClickRow(d.teacher)}
                  className="cursor-pointer"
                >
                  {d.teacher}
                </TableCell>
                <TableCell
                  onClick={() => onClickRow(d.year)}
                  className="cursor-pointer"
                >
                  {d.year}
                </TableCell>
                <TableCell
                  onClick={() => onClickRow(d.type)}
                  className="cursor-pointer"
                >
                  {d.type}
                </TableCell>
                <TableCell>
                  <Chip
                    color={statusColorMap[d.has_ans]}
                    size="lg"
                    variant="flat"
                  >
                    {d.has_ans == 1 ? "有" : "無"}
                  </Chip>
                </TableCell>
                <TableCell>
                  <Link
                    href={d.main_file}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="h-full hover:underline"
                  >
                    {decodeURIComponent(d.main_file.replace(/^.*[\\\/]/, ""))}
                  </Link>
                </TableCell>
                <TableCell>
                  <Link
                    href={`${pathname}/exam/${d.id}`}
                    className="h-full hover:underline"
                  >
                    {`>>`}
                  </Link>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </>
  );
}
