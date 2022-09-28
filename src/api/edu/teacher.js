import request from '@/utils/request'


export default {
    /**
     * 1 讲师列表（条件查询分页）
     * @param {*} current  当前页
     * @param {*} limit  每页记录数
     * @param {*} teacherQuery 条件对象
     * @returns 
     */
    getTeacherListPage(current, limit, teacherQuery){
        return request({
            url: `/eduService/teacher/pageTeacherCondition/${current}/${limit}`,
            method: 'post',
            /*
                teacherQuery条件对象，后端使用RequestBody获取数据
                data表示把对象转换为json传递到接口里面
            */
            data: teacherQuery
        })
    },
    // 根据id删除讲师
    deleteTeacherById(id){
        return request({
            url: `/eduService/teacher/delete/${id}`,
            method: 'delete'
        })
    },

    // 添加讲师
    addTeacher(teacher){
        return request({
            url: `/eduService/teacher/addTeacher`,
            method: 'post',
            data: teacher
        })
    },

    // 根据id查询讲师
    getTeacherById(id){
        return request({
            url: `/eduService/teacher/getTeacher/${id}`,
            method: 'get'
        })
    },

    // 编辑讲师
    updateTeacher(teacher){
        return request({
            url: `/eduService/teacher/updateTeacher`,
            method: 'post',
            data: teacher
        })
    }

}
