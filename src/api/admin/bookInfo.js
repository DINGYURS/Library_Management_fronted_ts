import request from '@/utils/request.js'

// 分页查询信息
export const pageQueryBookInfo = (page, pageSize, queryForm) => {
  return request.get('/api/admin/book/page', {
    params: {
      page,
      pageSize,
      bookName: queryForm.bookName,
      author: queryForm.author,
      category: queryForm.category
    }
  })
}

// 新增书籍信息
export const insertBookInfo = (addForm) => {
  return request.post('/api/admin/book', addForm)
}

// 修改书籍信息
export const editBookInfo = (editForm) => {
  return request.put(`/api/admin/book`, editForm)
}

// 删除书籍信息
export const deleteBookInfo = (ids) => {
  return request.delete(`/api/admin/book/${ids}`);
};


