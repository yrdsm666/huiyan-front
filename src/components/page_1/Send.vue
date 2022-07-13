<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-calendar"></i>保密发送
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="form-box">
                <!-- <el-form ref="formRef" :rules="rules" :model="form" label-width="135px"> -->
                <el-form ref="form" :model="form" :rules="rules" label-width="110px">
                    <el-form-item label="发送者身份" prop="sender">
                        <el-input v-model="form.sender"></el-input>
                    </el-form-item>
                    <!-- <el-form-item label="接收者身份" prop="receiver">
                        <el-input v-model="form.receiver"></el-input>
                    </el-form-item> -->
                    <template >
                        <el-form-item
                            v-for="(receiver, index) in form.receivers"
                            :label="'接收者' + (index+1) + '身份'"
                            :key="index"
                            :prop="'receivers.' + index + '.name'"
                            :rules="[
                                { required: true, message: '身份不能为空', trigger: 'blur' },
                                { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
                            ]"
                        >
                            <el-input v-model="receiver.name" style="width:93%"></el-input>
                            <i v-if="index===0" class="el-icon-circle-plus-outline" @click="addReceiver()" style="font-size: 20px; margin-left: 10px"/>
                            <i v-else class="el-icon-remove-outline" @click="removeReceiver(index)" style="font-size: 20px; margin-left: 10px "/>
                        </el-form-item>
                    </template>
                    <el-form-item label="类型">
                        <el-radio-group v-model="form.sendType">
                            <el-radio-button label="text" >文本</el-radio-button>
                            <el-radio-button label="file" >文件</el-radio-button>
                        </el-radio-group>
                    </el-form-item>
                    <template v-if="form.sendType == 'text'">
                        <el-form-item label="消息" prop="message">
                            <el-input type="textarea" rows="5" v-model="form.message"></el-input>
                        </el-form-item>
                    </template>
                    <template v-else>
                        <el-form-item label="选取文件">
                            <el-upload
                                class="upload-demo"
                                ref="uploadRef"
                                action="./confidentialSendText.json"
                                drag
                                :auto-upload="false"
                                :on-change="onChange"
                                :before-remove="beforeRemove"
                                :data="form"
                                :with-credentials="true"
                                :on-success="onSuccess"
                                :on-error="onError"
                            >
                                <!--
                                    :on-remove="handleRemove"
                                    :before-upload="beforeUpload"
                                    :on-success="upSuccess"
                                    :on-error="upError"
                                    :limit="1"
                                    :on-exceed="handleExceed"
                                    accept=".jpg, .png, .txt, .yaml"
                                -->
                                <i class="el-icon-upload"></i>
                                <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                                <template #tip>
                                    <div class="el-upload__tip">
                                        文件不要超过 5 MB
                                    </div>
                                </template>
                            </el-upload>
                        </el-form-item>
                        <!--
                        <el-form-item>
                            <el-button type="primary" @click="onFileSubmit()">发送消息</el-button>
                            <el-button type="primary" @click="$router.push('/hidden-receive')">接收消息</el-button>
                            <el-button @click="onReset">重置表单</el-button>
                        </el-form-item>
                        -->
                    </template>
                    <!-- <el-form-item label="掩蔽消息">
                        <el-radio-group v-model="form.shelter">
                            <el-radio-button label=0 >关闭</el-radio-button>
                            <el-radio-button label=1 >开启</el-radio-button>
                        </el-radio-group>
                    </el-form-item>
                    <template v-if="form.shelter == 1">
                        <el-form-item label="消息" prop="shelterMessage">
                            <el-input type="textarea" rows="5" v-model="form.shelterMessage"></el-input>
                        </el-form-item>
                    </template> -->
                    <el-form-item>
                        <el-button type="primary" @click="onSubmit()">发送消息</el-button>
                        <el-button type="primary" @click="$router.push('/receive')">接收消息</el-button>
                        <el-button @click="onReset">重置表单</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>
    </div>
</template>

<script>
import { confidentialSendText } from "../../api/confidentialSend"

export default {
    data() {
        return {
            form: {
                sender: "", //这里与rules中的规则对应
                receivers: [
                    {name:''},
                ],
                sendType: "text",
                message: "",
                fileMessage:"",
            },
            fileList: [],
            loading: null,
            rules: {
                sender: [
                    { required: true, message: '请输入发送者身份', trigger: 'blur' },
                    { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
                ],
                receiver: [
                    { required: true, message: '请输入接收者身份', trigger: 'blur' },
                    { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
                ],
            },
        };
    },
    created() {
        
    },
    methods: {
        onSubmit(){
            console.log("onSubmit");
            console.log(this.form);
            if (this.form.sender==="" || this.form.receivers===[]) {
                this.$message({
                    showClose: true,
                    message: '请输入完整的身份！',
                    type: 'error'
                });
                return;
            }
            if (this.form.sendType==="file" && this.form.fileMessage==="") {
                this.$message({
                    showClose: true,
                    message: '还没有选择文件！',
                    type: 'error'
                });
                return;
            }
            if (this.form.sendType==="text" && this.form.message==="") {
                this.$message({
                    showClose: true,
                    message: '请输入消息！',
                    type: 'error'
                });
                return;
            }

            this.$refs['form'].validate((valid) => {
                if (valid) {
                    this.loading = this.$loading({
                        lock: true,
                        text: 'Loading',
                        spinner: 'el-icon-loading',
                        background: 'rgba(0, 0, 0, 0.7)'
                    });
                    
                    if(this.form.sendType==="file"){
                        try{
                            this.$refs.uploadRef.submit();
                            // uploadRef.value.submit();
                            // 不能在这里loading.close()，因为当submit执行未结束时，仍会执行loading.close();
                        }
                        catch(e) {
                            this.$message({
                                showClose: true,
                                message: '文件发送失败',
                                type: 'error'
                            });
                            return;
                        }
                        //ElMessage.success("文件上传成功！");
                    }else{
                        // call post form api here.
                        this.form.fileMessage = '';
                        confidentialSendText(this.form).then((res) => {
                            this.loading.close();
                            this.$message({
                                showClose: true,
                                message: '发送消息成功',
                                type: 'success'
                            });
                        }).catch((error) => {
                            console.log(error);
                            this.loading.close();
                            this.$message({
                                showClose: true,
                                message: '发送消息失败',
                                type: 'error'
                            });
                        });
                    }
                } else {
                    this.$message({
                        showClose: true,
                        message: '请检查输入',
                        type: 'error'
                    });
                    return false;
                }
            });
        },

        onChange(file,list){
            // fileList.value = fileList.value.slice(-3);
            console.log("onChange");
            //this.fileList = [file];
            // console.log('uploadref value',file.file);
            // console.log('uploadref value',uploadRef);
            // console.log('uploadref value',uploadRef.value);
            // console.log('uploadref value',typeof (file));
            // console.log(file.raw);
            // console.log(file.raw.type);
            // console.log(typeof (file.raw));
            this.form.fileMessage=file;
            this.form.message='';
            //console.log(this.fileList);
            //console.log(this.form.fileMessage);
            // if(fileList.length>0) {
            //     form.file=formList[0].name;
            // }
        },

        beforeRemove(file,fileList){
            // console.log('old file name',form.file);
            // console.log('beforeRemove');
            this.form.fileMessage='';
        },

        onSuccess(){
            this.loading.close();
            this.$message({
                showClose: true,
                message: '发送消息成功',
                type: 'success'
            });
        },

        onError(){
            this.loading.close();
            this.$message({
                showClose: true,
                message: '文件发送失败',
                type: 'error'
            });
        },
  
        onReset(){
            console.log("onReset");
            this.form.sender = '';
            this.form.receivers = [ {name:''},];
            this.form.message = '';
            this.form.fileMessage = '';
            // this.$refs.form.resetFields();不好使问题多
            // console.log(this.$refs.uploadRef);
            if (this.$refs.uploadRef!==undefined) {
                this.$refs.uploadRef.clearFiles();
            }
            
            //this.$refs.form.fileMessage="";
        },
        removeReceiver(index){
            console.log(this.form.receivers);
            console.log(this.form.receivers[index]);
            this.form.receivers.splice(index, 1);
        },
        addReceiver(){
            this.form.receivers.push({name:''});
        },
    }
};

</script>