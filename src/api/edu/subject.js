import request from '@/utils/request'

export default {
    /**
     * 1 获取课程分类列表
     * 
     * @returns 
     */
    getSubjectList(){
        return request({
            url: `/eduService/eduSubject/get/subject/list`,
            method: 'get'
        })
    }
}