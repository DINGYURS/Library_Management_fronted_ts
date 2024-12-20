import request from "@/utils/request";

export const pageQueryArticleCategory = (page: number, pageSize: number) => {
  return request.get("/api/admin/category", {
    params: {
      page,
      pageSize,
    },
  });
};

export const insertArticleCategory = (addForm: any) => {
  return request.post("/api/admin/category", addForm);
};

export const updateArticleCategory = (editForm: any) => {
  return request.put("/api/admin/category", editForm);
};

export const deleteArticleCategory = (categoryId: number) => {
  return request.delete(`/api/admin/category/${categoryId}`);
};
//
// export const articleListService = (params) => {
//   return request.get('/article', {params})
// }
//
// export const articleAddService = (articleData) => {
//   return request.post('/article', articleData)
// }
//
// export const articleUpdateService = (articleData) => {
//   return request.put('/article', articleData)
// }
//
// export const articleDeleteService = (id) => {
//   return request.delete('/article?id=' + id)
// }
//
