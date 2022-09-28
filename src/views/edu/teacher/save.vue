<template>
  <div class="app-container">
    添加讲师
    <el-form label-width="120px">
      <el-form-item label="讲师名称">
        <el-input v-model="teacher.name"/>
      </el-form-item>
      <el-form-item label="讲师排序">
        <el-input-number v-model="teacher.sort" controls-position="right" :min="0"/>
      </el-form-item>
      <el-form-item label="讲师头衔">
        <el-select v-model="teacher.level" clearable placeholder="请选择">
          <!--
            数据类型一定要和取出的json中的一致，否则没法回填
            因此，这里value使用动态绑定的值，保证其数据类型是number
          -->
          <el-option :value= "1" label="高级讲师"/>
          <el-option :value= "2" label="首席讲师"/>
        </el-select>
      </el-form-item>
      <el-form-item label="讲师资历">
        <el-input v-model="teacher.career"/>
      </el-form-item>
      <el-form-item label="讲师简介">
        <el-input v-model="teacher.intro" :rows="10" type="textarea"/>
      </el-form-item>

      <!-- 讲师头像 -->
      <el-form-item label="讲师头像">
          <!-- 头衔缩略图 -->
          <pan-thumb :image="teacher.avatar"/>
          <!-- 文件上传按钮 -->
          <el-button type="primary" icon="el-icon-upload" @click="imagecropperShow=true">更换头像</el-button>

          <!--
          v-show：是否显示上传组件
          :key：类似于id，如果一个页面多个图片上传控件，可以做区分
          :url：后台上传的url地址
          @close：关闭上传组件
          @crop-upload-success：上传成功后的回调 -->
          <image-cropper
                        v-show="imagecropperShow"
                        :width="300"
                        :height="300"
                        :key="imagecropperKey"
                        :url="BASE_API+'/eduOss/fileoss/upload/avatar'"
                        field="file"
                        @close="close"
                        @crop-upload-success="cropSuccess"/>
      </el-form-item>

      <el-form-item>
        <el-button :disabled="saveBtnDisabled" type="primary" @click="saveOrUpdate">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
// 引入调用teacher.js文件
import teacherApi from '@/api/edu/teacher'
import ImageCropper from '@/components/ImageCropper'
import PanThumb from '@/components/PanThumb'

export default {
    components: {ImageCropper,PanThumb},
    data(){
        return{
            teacher:{
                name:'',
                sort:null,
                level:null,
                career:'',
                intro:'',
                avatar: ''
            },
            BASE_API: process.env.BASE_API,   // 接口API地址
            imagecropperShow:false,   // 是否显示上传组件
            imagecropperKey:0,  // 上传组件id
            saveBtnDisabled:false   // 保存按钮是否禁用
        }
    },

    watch: { // 监听
        $route(to, from) { // 路由变化方式，路由发生变化，方法就会执行
            this.init()
        }
    },
    created(){   // 页面渲染之前执行
        this.init()
    },
    methods:{

        // 上传成功后的回调函数
        cropSuccess(data) {
            console.log(data)
            this.teacher.avatar = data.url
            this.imagecropperShow = false
            // 上传成功后，重新打开上传组件时初始化组件，否则显示上一次的上传结果
            this.imagecropperKey = this.imagecropperKey + 1
        },

        // 关闭上传组件
        close() {
            this.imagecropperShow = false
            // 上传成功后，重新打开上传组件时初始化组件，否则显示上一次的上传结果
            this.imagecropperKey = this.imagecropperKey + 1
        },
        init(){
            // 判断路径是否有id值
            if(this.$route.params && this.$route.params.id){
                // 从路径获取id值
                const id = this.$route.params.id
                // 根据id获取讲师信息
                this.getTeacherInfoById(id)
            } else {
                this.teacher = {}
            }
        },
        // 根据讲师id查询查询讲师信息的方法
        getTeacherInfoById(id){
            teacherApi.getTeacherById(id)
                .then(response => {
                    console.log(response)
                    this.teacher = response.data.item
                })
        },
        // 保存或更新讲师信息
        saveOrUpdate(){
            this.saveBtnDisabled = true
            // 通过判断是否有teacher参数是否有id值，决定添加还是更新
            if(this.teacher.id){  // 如果有，更新
                this.updateTeacherInfo()
            } else{  // 没有，添加
                this.saveTeacherInfo()
            }
            
        },
        // 保存数据
        saveTeacherInfo(){
            teacherApi.addTeacher(this.teacher)
                .then(response => {
                    // 显示添加成功的提示信息
                    this.$message({
                        type: 'success',
                        message: '添加成功!'
                    });
                    // 跳到讲师列表页面
                    this.$router.push({path:'/teacher/list'})
                })
        },

        // 更新讲师信息
        updateTeacherInfo(){
            teacherApi.updateTeacher(this.teacher)
                .then(response => {
                    // 显示修改成功的提示信息
                    this.$message({
                        type: 'success',
                        message: '修改成功!'
                    });
                    // 跳到讲师列表页面
                    this.$router.push({path:'/teacher/list'})
                })
        }
    }
}
</script>