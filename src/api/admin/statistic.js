import request from '@/utils/request.js'

// 查询书本阅读量
export const getClassBorrowVolume = (start, end) => {
  return request.get('/api/admin/statistic/classBorrow', {
    params: {
      start,
      end
    }
  })
}

// 查询阅读积分Top10
export const getCreditScoreTop10 = () => {
  return request.get('/api/admin/statistic/top10')
}

// 查询每类图书的阅读量
export const getReadVolumeOfEachType = () => {
  return request.get('/api/admin/statistic/bookCategory')
}

