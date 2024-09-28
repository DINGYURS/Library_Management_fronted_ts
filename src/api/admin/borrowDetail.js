import request from '@/utils/request.js'

// 分页查询信息
export const pageQueryBorrowDetail = (page, pageSize, queryForm) => {
  return request.get('/api/admin/borrowDetail/page', {
    params: {
      page,
      pageSize,
      name: queryForm.name,
      username: queryForm.username,
      bookName: queryForm.bookName
    }
  })
}

// 新增借阅记录
export const insertBorrowDetail = (addForm) => {
  return request.post('/api/admin/borrowDetail', addForm,)
}

// 修改借阅记录
export const editBorrowDetail = (editForm) => {
  return request.put(`/api/admin/borrowDetail`, editForm)
}

// 删除借阅记录
export const deleteBorrowDetail = (ids) => {
  return request.delete(`/api/admin/borrowDetail/${ids}`);
};


