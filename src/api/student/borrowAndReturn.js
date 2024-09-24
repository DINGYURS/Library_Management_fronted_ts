import request from '@/utils/request.js'
import { useUserStore } from '@/stores/user.js'

// 借书
export const bookBorrow = (copyId) => {
  const userStore = useUserStore()
  return request.get('/api/student/bookBorrow', {
    params: {
      copyId
    },
    headers: {
      token: userStore.token
    }
  })
}
// 还书
export const bookReturn = (recordId) => {
  const userStore = useUserStore()
  return request.get('/api/student/bookReturn', {
    params: {
      recordId
    },
    headers: {
      token: userStore.token
    }
  })
}
