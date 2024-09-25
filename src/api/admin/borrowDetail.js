import request from '@/utils/request.js'
import { useUserStore } from '@/stores/user.js'

// 分页查询信息
export const pageQueryBorrowDetail = (page, pageSize, queryForm) => {
  const userStore = useUserStore()
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
  const userStore = useUserStore()
  return request.post('/api/admin/borrowDetail', addForm,)
}

// 修改借阅记录
export const editBorrowDetail = (editForm) => {
  const userStore = useUserStore()
  return request.put(`/api/admin/borrowDetail`, editForm)
}

// 删除借阅记录
export const deleteBorrowDetail = (ids) => {
  const userStore = useUserStore();
  return request.delete(`/api/admin/borrowDetail/${ids}`);
};


