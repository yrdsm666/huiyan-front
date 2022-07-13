<template>
    <div>
        <el-card class="box-card" style="height: 870px">
            <div slot="header" class="clearfix">
                <span style="font-size: 24px">初始化User</span>
            </div>
            <div class="text item">
                <div slot="header" class="clearfix">
                    <el-row :gutter="20">
                        <el-col :span="9">
                            <div class="grid-content bg-purple">
                                <div id="app">
                                    <el-form
                                        :visible.sync="showForm"
                                        :model="dynamicValidateForm"
                                        ref="dynamicValidateForm"
                                        label-width="100px"
                                        class="demo-dynamic"
                                    >
                                        <el-form-item
                                            label="用户名"
                                        >
                                            <el-row :gutter="20">
                                                <el-col :span="19">
                                                    <el-input v-model="dynamicValidateForm.name"></el-input>
                                                </el-col>
                                                <el-col :span="4"> </el-col>
                                            </el-row>
                                        </el-form-item>
                                        <el-form-item
                                            label="随机种子"
                                        >
                                            <el-row :gutter="20">
                                                <el-col :span="19">
                                                    <el-input v-model="dynamicValidateForm.sed"></el-input>
                                                </el-col>
                                                <el-col :span="4"> </el-col>
                                            </el-row>
                                        </el-form-item>
                                        <el-form-item
                                            v-for="(domain, index) in dynamicValidateForm.domains"
                                            :label="domain.value"
                                            :key="domain.key"
                                            :prop="'domains.' + index + '.value'"
                                            :rules="{ required: true, message: '属性不能为空', trigger: 'blur' }"
                                        >
                                            <el-row :gutter="20">
                                                <el-col :span="19">
                                                    <el-input v-model="domain.data" @input="change($event)"></el-input>
                                                </el-col>
                                                <el-col :span="4"></el-col>
                                            </el-row>
                                        </el-form-item>
                                        <el-form-item>
                                            <el-button type="primary" @click="submitForm('dynamicValidateForm')">初始化User</el-button>
                                            <el-button @click="askUserInfo">查看秘钥</el-button>
                                        </el-form-item>
                                    </el-form>
                                </div>
                            </div>
                        </el-col>
                        <el-col :span="8">
                            <div class="grid-content bg-purple"></div>
                        </el-col>
                    </el-row>
                </div>
            </div>
        </el-card>
        <el-dialog title="User秘钥" :visible.sync="dialogVisible" width="30%" center>
            <el-input type="textarea" :rows="35" v-model="userKey"> </el-input>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    data() {
        return {
            time: 0,
            showForm: false,
            dialogVisible: false,
            userPubKey: '',
            userPriKey: '',
            userTraceKey: '',
            userKey: '秘钥尚未生成，请初始化CA',
            dynamicValidateForm: {
                domains: [],
                sed: 32,
                name: 'admin'
            }
        };
    },
    created() {
        if (this.time === 0) {
            this.getData();
            this.time++;
        }
    },
    methods: {
        change(e) {
            this.$forceUpdate();
        },
        postData() {
            let attributions = [];
            console.log("检查")
          if (this.dynamicValidateForm.domains[2].data !== '') {
            var reg=/^1[3456789]\d{9}$/;
            if(!reg.test(this.dynamicValidateForm.domains[2].data)){
              alert(new Error('请输入有效的手机号码'));
              return
            }
          }else{
            alert(new Error('请输入有效的手机号码'));
            return
          }

          if (this.dynamicValidateForm.domains[3].data !== '') {
            var reg=/^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
            if(!reg.test(this.dynamicValidateForm.domains[3].data)){
              alert(new Error('请输入有效的邮箱'));
              return
            }
          }else{
            alert(new Error('请输入有效的邮箱'));
            return
          }
            for (let i = 0; i < this.dynamicValidateForm.domains.length; i++) {
                attributions[i] = this.dynamicValidateForm.domains[i].data;
            }
            console.log(attributions);
            let param = {
                attributions: attributions,
                sed: this.dynamicValidateForm.sed,
                user: this.dynamicValidateForm.name
            };
            axios
                .post(this.apiUrl + '/initUser', param)
                .then((response) => {
                    if (response.data.code === '200') {
                        this.userPriKey = response.data.Pri;
                        this.userPubKey = response.data.Pub;
                        this.userTraceKey = response.data.Trace;
                        this.userKey =
                            '_________公钥_________\n' +
                            this.userPubKey +
                            '\n_________私钥_________\n' +
                            this.userPriKey +
                            '\n_________trace_________\n' +
                            this.userTraceKey;
                        this.dialogVisible = true;
                        console.log(response.data);
                        this.$message({
                            message: '用时：' + response.data.Spend / 1000000 + '（毫秒）',
                            duration: 0,
                            showClose: true
                        });
                    }
                    if (response.data.code === '400') {
                        alert(response.data.msg);
                    }
                })
                .catch((response) => {
                    alert(response);
                });
        },
        askUserInfo() {
            let param = {
                user: this.dynamicValidateForm.name
            };
            axios
                .post(this.apiUrl + '/getUserInfo', param)
                .then((response) => {
                    this.userPriKey = response.data.Pri;
                    this.userPubKey = response.data.Pub;
                    this.userTraceKey = response.data.Trace;
                    for (let i = 0; i < response.data.Attributions.length; i++) {
                        this.dynamicValidateForm.domains[i].data = response.data.Attributions[i];
                    }
                    this.userKey =
                        '_________公钥_________\n' +
                        this.userPubKey +
                        '\n_________私钥_________\n' +
                        this.userPriKey +
                        '\n_________trace_________\n' +
                        this.userTraceKey;
                    this.dialogVisible = true;
                })
                .catch((response) => {
                    console.log('运行报错');
                    alert(response);
                });
        },
        getData() {
            axios
                .post(this.apiUrl + '/getAttributions')
                .then((response) => {
                    if (response.data.code === '200') {
                        for (let i = 0; i < response.data.Attributions.length; i++) {
                            this.dynamicValidateForm.domains[i] = {
                                value: response.data.Attributions[i],
                                data: ''
                            };
                        }
                    }
                    this.showForm = true;
                    if (response.data.code === '400') {
                        console.log('1');
                        alert(response.data.msg);
                    }
                })
                .catch((response) => {
                    console.log('2');
                    alert(response);
                });
        },

        handleClose(done) {
            this.$confirm('确认关闭？')
                .then((_) => {
                    this.dialogVisible = false;
                    done();
                })
                .catch((_) => {});
        },
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.postData();
                } else {
                    this.$alert('初始化失败', '初始化CA', {
                        confirmButtonText: '确定',
                        callback: (action) => {
                            this.$message({
                                type: 'info',
                                message: `action: ${action}`
                            });
                        }
                    });
                    return false;
                }
            });
        },
        resetForm(formName) {
            this.$refs[formName].resetFields();
        },
        removeDomain(item) {
            var index = this.dynamicValidateForm.domains.indexOf(item);
            if (index !== -1) {
                this.dynamicValidateForm.domains.splice(index, 1);
            }
        },
        addDomain() {
            this.dynamicValidateForm.domains.push({
                value: '',
                key: Date.now()
            });
        }
    }
};
</script>


<style scoped>
@import url('//unpkg.com/element-ui@2.14.1/lib/theme-chalk/index.css');
</style>
