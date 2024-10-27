import request from "@/utils/request.ts";
import { QueryForm } from "@/types/borrowStatisticTypes.ts"; // 引入类型

// 分页查询书本阅读量
export const pageQueryBorrowStatistic = (
  page: number,
  pageSize: number,
  queryForm: QueryForm,
) => {
  return request.get("/api/admin/borrowStatistic/page", {
    params: {
      page,
      pageSize,
      bookName: queryForm.bookName,
    },
  });
};
