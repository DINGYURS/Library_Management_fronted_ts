import request from '@/utils/request.js'
import { useUserStore } from '@/stores/user.js'

// 分页查询书本阅读量
export const pageQueryBorrowStatistic = (page, pageSize, queryForm) => {
  const userStore = useUserStore()
  return request.get('/api/admin/borrowStatistic/page', {
    params: {
      page,
      pageSize,
      bookName: queryForm.bookName
    }
  })
}

