import request from '@/utils/request'

export default {
    /**
     * 1 获取课程大纲列表
     * 
     * @returns 
     */
    getAllChapterVideoList(courseId){
        return request({
            url: `/eduService/eduChapter/get/chapterAndVideo/list/${courseId}`,
            method: 'get'
        })
    },

    /**
     * 保存章节信息到数据库表中
     * @param {*} chapter 
     * @returns 
     */
    addChapter(chapter){
        return request({
            url: `/eduService/eduChapter/add/chapter`,
            method: 'post',
            data: chapter
        })
    },
    /**
     * 删除章节信息
     * 
     * @returns 
     */
    deleteChapter(chapterId){
        return request({
            url: `/eduService/eduChapter/delete/chapter/${chapterId}`,
            method: 'get'
        })
    },

    /**
     * 更新章节信息
     * @param {*} chapter 
     * @returns 
     */
    updateChapter(chapter){
        return request({
            url: `/eduService/eduChapter/update/chapter`,
            method: 'post',
            data: chapter
        })
    },

    /**
     * 根据id查询章节信息
     * @param {*} chapterId 
     * @returns 
     */
    getChapterById(chapterId){
        return request({
            url: `/eduService/eduChapter/get/chapter/${chapterId}`,
            method: 'get'
        })
    }

}