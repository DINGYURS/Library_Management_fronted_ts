import request from "@/utils/request";
import type { ArticleInfo, ArticlePageQuery } from "@/types/articleTypes.ts";
export const pageQueryArticle = (
  page: number,
  pageSize: number,
  queryForm: ArticlePageQuery,
) => {
  return request.get("/student/article/page", {
    params: {
      page,
      pageSize,
      title: queryForm.title,
      categoryName: queryForm.categoryName,
      status: queryForm.status,
      role: queryForm.role
    },
  });
};

export const insertArticle = (addForm: ArticleInfo) => {
  return request.post("/student/article", addForm);
};

export const updateArticle = (editForm: ArticleInfo) => {
  return request.put("/student/article", editForm);
};

export const deleteArticle = (categoryId: number) => {
  return request.delete(`/student/article/${categoryId}`);
};

export const getCategoryInfo = () => {
  return request.get("/student/article");
}
