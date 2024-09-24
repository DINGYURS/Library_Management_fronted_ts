import request from '@/utils/request.js'
import { useUserStore } from '@/stores/user.js'

// 查询书本阅读量
export const getClassBorrowVolume = (start, end) => {
  const userStore = useUserStore()
  return request.get('/api/admin/statistic/classBorrow', {
    params: {
      start,
      end
    },
    headers: {
      token: userStore.token
    }
  })
}

// 查询阅读积分Top10
export const getCreditScoreTop10 = () => {
  const userStore = useUserStore()
  return request.get('/api/admin/statistic/top10', {
    headers: {
      token: userStore.token
    }
  })
}

// 查询每类图书的阅读量
export const getReadVolumeOfEachType = () => {
  const userStore = useUserStore()
  return request.get('/api/admin/statistic/bookCategory', {
    headers: {
      token: userStore.token
    }
  })
}

