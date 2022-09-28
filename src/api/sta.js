import request from '@/utils/request'

export default {
    // 生成统计数据
    createStatisticsDaily(day) {
        return request({
            url: `/serviceStatistics/statisticsDaily/create/statistics/${day}`,
            method: 'get'
        })
    },

    // 获取统计数据
    showStatistics(searchObj){
        return request({
            url: `/serviceStatistics/statisticsDaily/show/statistics`,
            method: 'post',
            data: searchObj
        })
    }
}