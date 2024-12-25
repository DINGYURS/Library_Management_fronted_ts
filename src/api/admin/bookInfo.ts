import request from "@/utils/request.ts";
import { BookForm, QueryForm } from "@/types/bookTypes.ts";
// 分页查询书籍信息
export const pageQueryBookInfo = (
  page: number,
  pageSize: number,
  queryForm: QueryForm,
) => {
  return request.get("/admin/book/page", {
    params: {
      page,
      pageSize,
      bookName: queryForm.bookName,
      author: queryForm.author,
      category: queryForm.category,
    },
  });
};

// 新增书籍信息
export const insertBookInfo = (addForm: BookForm) => {
  return request.post("/admin/book", addForm);
};

// 修改书籍信息
export const editBookInfo = (editForm: BookForm) => {
  return request.put(`/admin/book`, editForm);
};

// 删除书籍信息
export const deleteBookInfo = (ids: number[]) => {
  return request.delete(`/admin/book/${ids}`);
};
