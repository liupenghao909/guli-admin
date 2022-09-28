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
    },

    /**
     * 2 获取讲师列表
     * @returns 讲师列表
     */
    getTeacherList(){
        return request({
            url: `/eduService/teacher/findAllTeacher`,
            method: 'get'
        })
    },

    /**
     * 存储课程信息，返回课程ID
     * @param {*} courseInfo 
     * @returns 
     */
    saveCourseInfo(courseInfo){
        return request({
            url: '/eduService/eduCourse/save/course/info',
            method: 'post',
            data: courseInfo
        })
    },

    /**
     * 根据课程ID获取课程信息
     * @param {} courseId
     * @returns 
     */
    getCourseInfoById(courseId){
        return request({
            url: `/eduService/eduCourse/get/courseInfo/${courseId}`,
            method: 'get'
        })
    },

    /**
     * 更新课程信息
     * @param {课程信息} courseInfo 
     * @returns 
     */
    updateCourseInfo(courseInfo){
        return request({
            url: `/eduService/eduCourse/update/courseInfo`,
            method: 'post',
            data: courseInfo
        })
    },

    /**
     * 根据课程id获取发布课程信息
     * @param {*} courseId 
     * @returns 
     */
    getPublishCourseInfo(courseId){
        return request({
            url: `/eduService/eduCourse/get/publishCourse/${courseId}`,
            method: 'get'
        })
    },

    /**
     * 发布课程
     * @param {} courseId 
     */
    publishCourse(courseId){
        return request({
            url: `/eduService/eduCourse/publish/course/${courseId}`,
            method: 'get'
        })
    },

    /**
     * 条件分页查询课程列表
     * 
     */
    getpageCourseList(current, limit, teacherQuery){
        return request({
            url: `/eduService/eduCourse/pageCourseCondition/${current}/${limit}`,
            method: 'post',
            data: teacherQuery
        })
    },

    /**
     * 删除课程
     * @param {*} courseId 
     * @returns 
     */
    deleteCourseById(courseId){
        return request({
            url: `/eduService/eduCourse/delete/course/${courseId}`,
            method: 'get'
        })
    }
}