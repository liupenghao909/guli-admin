import request from '@/utils/request'

export default {
    deleteVideoInAliyunById(videoId){
        return request({
            url: `/eduVod/video/delete/AliyunVideo/${videoId}`,
            method: 'get'
        })
    }
}