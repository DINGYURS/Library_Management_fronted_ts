import request from "@/utils/request.ts";
import { QueryForm } from "@/types/bookTypes.ts";

// 分页查询信息
export const pageQueryBorrowDetailIndividual = (
  page: number,
  pageSize: number,
  queryForm: QueryForm,
) => {
  return request.get("/student/borrowDetail/page", {
    params: {
      page,
      pageSize,
      bookName: queryForm.bookName,
      author: queryForm.author,
      category: queryForm.category,
    },
  });
};
