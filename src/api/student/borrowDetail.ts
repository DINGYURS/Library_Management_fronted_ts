import request from '@/utils/request.ts'

// 分页查询信息
export const pageQueryBorrowDetailIndividual = (page, pageSize, queryForm) => {
  return request.get('/api/student/borrowDetail/page', {
    params: {
      page,
      pageSize,
      bookName: queryForm.bookName,
      author: queryForm.author,
      category: queryForm.category
    }
  })
}


