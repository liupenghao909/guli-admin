<template>

      <div class="app-container">
        <h2 style="text-align: center;">发布新课程</h2>
        <el-steps :active="1" process-status="wait" align-center style="margin-bottom: 40px;">
          <el-step title="填写课程基本信息"/>
          <el-step title="创建课程大纲"/>
          <el-step title="保存提交"/>
        </el-steps>

        <el-form label-width="120px">

            <el-form-item label="课程标题">
                <el-input v-model="courseInfo.title" placeholder=" 示例：机器学习项目课：从基础到搭建项目视频课程。专业名称注意大小写"/>
            </el-form-item>

            <!-- 所属分类：级联下拉列表 -->
            
            <el-form-item label="课程类别">
                <!-- 一级分类 -->
                <el-select
                    v-model="courseInfo.subjectParentId"
                    placeholder="一级分类"
                    @change="subjectOneChanged">   
                    <el-option
                    v-for="subject in subjectOneList"
                    :key="subject.id"
                    :label="subject.title"
                    :value="subject.id"/>
                </el-select>
                <!-- 二级分类 -->
                <el-select
                    v-model="courseInfo.subjectId"
                    placeholder="二级分类">
                    <el-option
                    v-for="subject in subjectTwoList"
                    :key="subject.id"
                    :label="subject.title"
                    :value="subject.id"/>
                </el-select>
            </el-form-item>

            <!-- 课程讲师 TODO -->
            <el-form-item label="讲师列表">
                <el-select
                    v-model="courseInfo.teacherId"
                    placeholder="请选择">
                    <el-option
                    v-for="teacher in teacherList"
                    :key="teacher.id"
                    :label="teacher.name"
                    :value="teacher.id"/>
                </el-select>
            </el-form-item>

            <el-form-item label="总课时">
                <el-input-number :min="0" v-model="courseInfo.lessonNum" controls-position="right" placeholder="请填写课程的总课时数"/>
            </el-form-item>

            <!-- 课程简介 TODO -->
            <el-form-item label="课程简介">
                <tinymce :height="300" v-model="courseInfo.description"/>
            </el-form-item>

            <!-- 课程封面
                选择完图片自动上传
            -->
            <el-form-item label="课程封面">
                <el-upload
                    :show-file-list="false"
                    :on-success="handleAvatarSuccess"
                    :before-upload="beforeAvatarUpload"
                    :action="BASE_API+'/eduOss/fileoss/upload/avatar?host=cover'"
                    class="avatar-uploader">
                    <img :src="courseInfo.cover" style="width: 200px;height: 150px;">
                </el-upload>
            </el-form-item>

            <el-form-item label="课程价格">
                <el-input-number :min="0" v-model="courseInfo.price" controls-position="right" placeholder="免费课程请设置为0元"/> 元
            </el-form-item>

            <el-form-item>
                <el-button :disabled="saveBtnDisabled" type="primary" @click="saveOrUpdate">保存并下一步</el-button>
            </el-form-item>
        </el-form>

      </div>
</template>

<script>
    import course from '@/api/edu/course'
    import Tinymce from '@/components/Tinymce'
    import subject from '../../../api/edu/subject'
export default {

    // 声明组件
    components: {Tinymce},

    data() {
        return {
            saveBtnDisabled: false, // 保存按钮是否禁用
            courseInfo:{
                title:"",
                subjectParentId:"",
                subjectId:"",
                teacherId:"",
                lessonNum:0,
                cover: process.env.OSS_PATH + 'cover/default.jpg',   // 默认值为oss默认封面地址
                price:0.0
            },
            courseId:"",
            teacherList:[],  // 存储下拉选择框中可供选择的讲师
            subjectOneList:[],  // 存储下拉选择框中可供选择的一级课程分类
            subjectTwoList:[],  // 存储下拉选择框中可供选择的二级课程分类
            BASE_API: process.env.BASE_API // 接口API地址
        }
    },

    created() {
        // 根据路径中是否是否含有courseId参数，判断是保存课程信息还是更新课程信息（即从下一步中返回回来的课程信息修改）
        if(this.$route.params && this.$route.params.id){
            this.courseId = this.$route.params.id
            // 根据courseId查询课程信息进行回显
            this.fetchCourseInfoById(this.courseId)
        } else {
            this.courseInfo = { 
                title:"",
                subjectParentId:"",
                subjectId:"",
                teacherId:"",
                lessonNum:0,
                cover: process.env.OSS_PATH + 'cover/default.jpg',   // 默认值为oss默认封面地址
                price:0.0
            }
           // 初始化一级课程分类列表
            this.getSubjectOneList() 
        }
        //  初始化讲师列表
        this.getAllTeacherList()
        
    },

    methods: {
        /**
         * 根据课程ID查询课程信息进行回显
         */
        fetchCourseInfoById(courseId){
            console.log(courseId)
            course.getCourseInfoById(courseId)
                .then(response => {
                    this.courseInfo = response.data.courseInfoVO
                    console.log(this.courseInfo.subjectParentId)
                    // 初始化一级课程分类
                    course.getSubjectList()
                    .then(response => {
                        this.subjectOneList = response.data.list
                        // 对课程二级课程分类回显进行处理
                        for(var i = 0;i < this.subjectOneList.length;i++){
                        console.log(this.subjectOneList[i].id)
                        if(this.subjectOneList[i].id === this.courseInfo.subjectParentId){
                            this.subjectTwoList = this.subjectOneList[i].children
                        }
                    } 
                    })
                    
                    
                    
                })
                .catch(error => {
                    console.log(error)
                    this.$message({
                    type: 'error',
                    message: '回显课程信息时，获取课程信息失败'
                    })
                })
        },
        // 上传课程封面成功运行的函数
        handleAvatarSuccess(res, file){
            this.courseInfo.cover = res.data.url
        },

        // 上传课程封面之前运行的函数
        beforeAvatarUpload(file){
            const isJPG = file.type === 'image/jpeg'
            const isLt2M = file.size / 1024 / 1024 < 2
            if (!isJPG) {
                this.$message.error('上传头像图片只能是 JPG 格式!')
            }
            if (!isLt2M) {
                this.$message.error('上传头像图片大小不能超过 2MB!')
            }
            // return isJPG && isLt2M
            // 暂时只做大小判断
            return isLt2M
        },

        saveOrUpdate(){
            // 有id说明是更新
            if(this.courseInfo.id){
                this.update()
            } else {
                this.save()
            }
        },

        // 更新课程信息
        update(){
            course.updateCourseInfo(this.courseInfo)
                .then(response => {
                    this.$message({
                        type: 'success',
                        message: '更新课程信息成功'
                    })
                    
                    // 2 跳转到chapter页面
                    this.$router.push({path: '/course/chapter/'+this.courseId})

                })
                .catch(error => {
                    this.$message({
                    type: 'success',
                    message: '更新课程信息失败'
                    })
                })
        },
        // 存储课程信息
        save(){
            course.saveCourseInfo(this.courseInfo)
                .then(response => {
                    // 保存成功，
                    // 1 显示保存成功弹窗
                    this.$message({
                    type: 'success',
                    message: '存储课程信息成功'
                    })
                    // 2 跳转到chapter页面
                    this.$router.push({path: '/course/chapter/'+response.data.courseId})
                })
                .catch(error => {
                    console.log(error)
                    this.$message({
                        type: 'error',
                        message: '上传课程分类失败'
                    })
                })
            
        },

        // 获取讲师列表
        getAllTeacherList(){
            course.getTeacherList()
                .then(response => {
                    this.teacherList = response.data.items
                })
                .catch(error => {
                    alert("获取讲师列表失败")
                })
        },

        // 获取课程分类列表（树形）
        getSubjectOneList(){
            course.getSubjectList()
                .then(response => {
                    this.subjectOneList = response.data.list
                })
                .catch(error => {
                    alert("获取课程分类列表失败")
                })
        },

        /** 
         * @change:subjectOneChanged 和改变事件绑定，当内容改变时，执行subjectOneChanged函数，获取一级课程对应的二级课程
         * value 对应的是 v-for 中的:value 即一级分类课程ID
         * 
         *  函数根据一级课程去查二级课程列表
         * */ 

        subjectOneChanged(value){
            for(var i = 0;i < this.subjectOneList.length;i++){
                var subjectOne = this.subjectOneList[i]
                if(subjectOne.id === value){
                    this.subjectTwoList = subjectOne.children
                    this.courseInfo.subjectId = ''
                }
            }
        }
    }
}
</script>

<style scoped>
    .tinymce-container {
      line-height: 29px;
    }
</style>
