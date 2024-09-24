import request from '@/utils/request.js'
import { useUserStore } from '@/stores/user.js'

// 分页查询信息
export const pageQueryBookInfo = (page, pageSize, queryForm) => {
  const userStore = useUserStore()
  return request.get('/api/admin/book/page', {
    params: {
      page,
      pageSize,
      bookName: queryForm.bookName,
      author: queryForm.author,
      category: queryForm.category
    },
    headers: {
      token: userStore.token
    }
  })
}

// 新增书籍信息
export const insertBookInfo = (addForm) => {
  const userStore = useUserStore()
  return request.post('/api/admin/book', addForm, {
    headers: {
      token: userStore.token
    }
  })
}

// 修改书籍信息
export const editBookInfo = (editForm) => {
  const userStore = useUserStore()
  return request.put(`/api/admin/book`, editForm, {
    headers: {
      token: userStore.token
    }
  })
}

// 删除书籍信息
export const deleteBookInfo = (ids) => {
  const userStore = useUserStore();
  return request.delete(`/api/admin/book/${ids}`,{
    headers: {
      token: userStore.token,
    },
  });
};


