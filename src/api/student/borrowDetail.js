import request from '@/utils/request.js'
import { useUserStore } from '@/stores/user.js'

// 分页查询信息
export const pageQueryBorrowDetailIndividual = (page, pageSize, queryForm) => {
  const userStore = useUserStore()
  return request.get('/api/student/borrowDetail/page', {
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


