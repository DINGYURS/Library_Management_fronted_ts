import request from '@/utils/request.ts'

// 借书
export const bookBorrow = (copyId) => {
  return request.get('/api/student/bookBorrow', {
    params: {
      copyId
    }
  })
}
// 还书
export const bookReturn = (recordId) => {
  return request.get('/api/student/bookReturn', {
    params: {
      recordId
    }
  })
}
