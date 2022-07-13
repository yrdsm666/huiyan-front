<template>
    <div>
        <el-card class="box-card" style="height: 870px">
            <div slot="header" class="clearfix">
                <span style="font-size: 24px">证书随机化（签名）</span>
            </div>
            <div class="text item">
                <div slot="header" class="clearfix">
                    <el-row :gutter="20">
                        <el-col :span="17">
                            <div class="grid-content bg-purple">
                                <div id="app">
                                    <el-form
                                        :model="dynamicValidateForm"
                                        ref="dynamicValidateForm"
                                        label-width="100px"
                                        class="demo-dynamic"
                                    >
                                        <el-form-item label="用户名字">
                                            <el-input type="textarea" @blur="askUserInfo" :rows="1" v-model="dynamicValidateForm.name"> </el-input>
                                        </el-form-item>
                                        <el-form-item label="出示属性">
                                            <template>
                                                <el-checkbox-group v-model="nyAttributionsChecked" @change="handleCheckedCitiesChange">
                                                    <el-checkbox
                                                        v-for="attribution in nyAttributionsOptions"
                                                        :label="attribution"
                                                        :key="attribution"
                                                        >{{ attribution }}
                                                    </el-checkbox>
                                                </el-checkbox-group>
                                            </template>
                                        </el-form-item>
                                        <el-form-item label="消息">
                                            <el-input :rows="5" type="textarea" v-model="dynamicValidateForm.msg"></el-input>
                                        </el-form-item>
                                        <el-form-item label="用户私钥">
                                            <el-input :rows="3" type="textarea" v-model="dynamicValidateForm.usk"></el-input>
                                        </el-form-item>
                                        <el-form-item label="证书信息">
                                            <el-input type="textarea" :rows="12" v-model="dynamicValidateForm.cred"> </el-input>
                                        </el-form-item>
                                        <el-form-item>
                                            <el-button type="primary" @click="submitForm('dynamicValidateForm')">随机化证书</el-button>
                                            <el-button @click="dialogVisible = true">查看随机化证书</el-button>
                                        </el-form-item>
                                    </el-form>
                                </div>
                            </div>
                        </el-col>
                        <el-col :span="2">
                            <div class="grid-content bg-purple"></div>
                        </el-col>
                    </el-row>
                </div>
            </div>
        </el-card>
        <el-dialog title="随机化证书（签名）" :visible.sync="dialogVisible" width="30%" center>
            <el-input type="textarea" :rows="6" v-model="nymCredential"> </el-input>
            <el-input type="textarea" :rows="1" v-model="transactionId"> </el-input>
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
            checkAll: false,
            isIndeterminate: true,
            dialogVisible: false,
            nymCredential: '',
            transactionId: '',
            dynamicValidateForm: {
                cred: '',
                msg: '',
                name: 'admin',
                attributions: [],
                usk: ''
            },
            nyAttributionsOptions: [],
            nyAttributionsChecked: []
        };
    },
    created() {
        this.getData();
        this.askUserInfo();
    },
    methods: {
        handleClose(done) {
            this.$confirm('确认关闭？')
                .then((_) => {
                    this.dialogVisible = false;
                    done();
                })
                .catch((_) => {});
        },
        getData() {
            axios
                .post(this.apiUrl + '/getAttributions')
                .then((response) => {
                    if (response.data.code === '200') {
                        this.nyAttributionsOptions = response.data.Attributions;
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
        postData() {
            let nyAttri = [];
            console.log('xunzhao!!');
            for (let i = 0; i < this.nyAttributionsOptions.length; i++) {
                for (let j = 0; j < this.nyAttributionsChecked.length; j++) {
                    console.log(i, j, this.nyAttributionsOptions[i], this.nyAttributionsChecked[j]);
                    if (this.nyAttributionsOptions[i] === this.nyAttributionsChecked[j]) {
                        nyAttri[i] = 1;
                        break;
                    }
                    nyAttri[i] = 0;
                }
            }
            let param = {
                user: this.dynamicValidateForm.name,
                ny: nyAttri,
                msg: this.dynamicValidateForm.msg
            };
            console.log(param);
            axios
                .post(this.apiUrl + '/createRandomCredential', param)
                .then((response) => {
                    if (response.data.code === '200') {
                        console.log(response.data);
                        this.nymCredential = response.data.Random;
                        this.transactionId = response.data.transactionID;
                        // this.credentialRequest = response.data.Cr
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

        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.postData();
                    this.issuerKey = '_________公钥_________\n' + this.issuerPubKey + '\n_________私钥_________\n' + this.issuerPriKey;
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
        askUserInfo() {
            let param = {
                user: this.dynamicValidateForm.name
            };
            axios
                .post(this.apiUrl + '/getUserInfo', param)
                .then((response) => {
                    console.log(response.data);
                    this.dynamicValidateForm.usk = response.data.Pri;
                    this.dynamicValidateForm.cred = response.data.Cred;
                    console.log(response.data);
                })
                .catch((response) => {
                    console.log('运行报错');
                    alert(response);
                });
        },
        handleCheckAllChange(val) {
            this.nyAttributionsChecked = val ? this.nyAttributionsOptions : [];
            this.isIndeterminate = false;
        },
        handleCheckedCitiesChange(value) {
            let checkedCount = value.length;
            this.checkAll = checkedCount === this.nyAttributionsOptions.length;
            this.isIndeterminate = checkedCount > 0 && checkedCount < this.nyAttributionsOptions.length;
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
