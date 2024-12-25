import request from "@/utils/request";
import type { ArticleInfo, ArticlePageQuery } from "@/types/articleTypes.ts";

export const pageQueryArticleCategory = (page: number, pageSize: number) => {
  return request.get("/admin/category/page", {
    params: {
      page,
      pageSize,
    },
  });
};

export const insertArticleCategory = (addForm: any) => {
  return request.post("/admin/category", addForm);
};

export const updateArticleCategory = (editForm: any) => {
  return request.put("/admin/category", editForm);
};

export const deleteArticleCategory = (categoryId: number) => {
  return request.delete(`/admin/category/${categoryId}`);
};

export const pageQueryArticle = (
  page: number,
  pageSize: number,
  queryForm: ArticlePageQuery,
) => {
  return request.get("/admin/article/page", {
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
  return request.post("/admin/article", addForm);
};

export const updateArticle = (editForm: ArticleInfo) => {
  return request.put("/admin/article", editForm);
};

export const deleteArticle = (categoryId: number) => {
  return request.delete(`/admin/article/${categoryId}`);
};

export const getCategoryInfo = () => {
  return request.get("/admin/category");
}
