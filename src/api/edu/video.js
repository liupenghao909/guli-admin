import request from '@/utils/request'

export default {
    /**
     * 1 获取小节信息
     * 
     * @returns 
     */
    getVideoById(videoId){
        return request({
            url: `/eduService/eduVideo/get/video/${videoId}`,
            method: 'get'
        })
    },

    /**
     * 保存小节信息
     * @param {*} video 
     * @returns 
     */
    addVideo(video){
        return request({
            url: `/eduService/eduVideo/add/video`,
            method: 'post',
            data: video
        })
    },

    /**
     * 删除小节信息
     * @param {} videoId 
     * @returns 
     */
    deleteVideoById(videoId){
        return request({
            url: `/eduService/eduVideo/delete/video/${videoId}`,
            method: 'get'
        })
    },

    /**
     * 更新课程信息
     * @param {*} video 
     * @returns 
     */
    updateVideo(video){
        return request({
            url: `/eduService/eduVideo/update/video`,
            method: 'post',
            data: video
        })
    }
}