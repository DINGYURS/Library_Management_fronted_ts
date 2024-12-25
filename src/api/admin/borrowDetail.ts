import request from "@/utils/request.ts";
import { BorrowDetail, QueryForm } from "@/types/borrowDetailTypes.ts";

// 分页查询借阅信息
export const pageQueryBorrowDetail = (
  page: number,
  pageSize: number,
  queryForm: QueryForm,
) => {
  return request.get("/admin/borrowDetail/page", {
    params: {
      page,
      pageSize,
      name: queryForm.name,
      username: queryForm.username,
      bookName: queryForm.bookName,
    },
  });
};

// 新增借阅记录
export const insertBorrowDetail = (addForm: BorrowDetail) => {
  return request.post("/admin/borrowDetail", addForm);
};

// 修改借阅记录
export const editBorrowDetail = (editForm: BorrowDetail) => {
  return request.put(`/admin/borrowDetail`, editForm);
};

// 删除借阅记录
export const deleteBorrowDetail = (ids: number[]) => {
  return request.delete(`/admin/borrowDetail/${ids}`);
};
