import request from '@/utils/request.js'

// 分页查询书本阅读量
export const pageQueryBorrowStatistic = (page, pageSize, queryForm) => {
  return request.get('/api/admin/borrowStatistic/page', {
    params: {
      page,
      pageSize,
      bookName: queryForm.bookName
    }
  })
}

