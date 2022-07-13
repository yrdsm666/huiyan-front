<template>
    <div>
        <el-card class="box-card" style="margin-top: 20px">
            <div slot="header" class="clearfix">
                <span style="font-size: 24px">用户信息集合</span>
            </div>
            <div class="text item">
                <div slot="header" class="clearfix" style="margin-left: 80px">
                    <template>
                        <el-table stripe style="width: 100%" :data="table">
                            <el-table-column prop="User" label="用户名" width="100"> </el-table-column>
                            <el-table-column prop="Pub" label="公钥（部分）" width="400"> </el-table-column>
                            <el-table-column prop="Org" label="组织" width="100"> </el-table-column>
                            <el-table-column prop="Country" label="所在国家" width="100"> </el-table-column>

                            <el-table-column prop="Tel" label="电话" width="100"> </el-table-column>

                            <el-table-column prop="Email" label="Email" width="100"> </el-table-column>
                            <el-table-column prop="Id" label="ID" width="100"> </el-table-column>
                        </el-table>
                    </template>
                </div>
            </div>
        </el-card>
        <el-card class="box-card" style="margin-top: 20px; height: 550px">
            <div slot="header" class="clearfix">
                <span style="font-size: 24px">追踪作恶用户</span>
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
                                        <el-form-item label="签名">
                                            <el-input :rows="5" type="textarea" v-model="dynamicValidateForm.sig"></el-input>
                                        </el-form-item>
                                        <el-form-item label="交易id">
                                            <el-input :rows="5" type="textarea" v-model="dynamicValidateForm.transactionID"></el-input>
                                        </el-form-item>
                                        <el-form-item>
                                            <el-button type="primary" @click="submitForm('dynamicValidateForm')">追踪</el-button>
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
        <el-dialog title="追踪到的用户公钥" :visible.sync="dialogVisible" width="30%" center>
            <el-input type="textarea" :rows="21" v-model="pubKey"> </el-input>
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
            pubKey: '',
            table: [
                {
                    Attributions: [''],
                    User: '',
                    Pub: '',
                    Org: '',
                    Country: '',
                    Tel: '',
                    Email: '',
                    Id: ''
                }
            ],
            AttributionName: [],
            dialogVisible: false,
            issuerKey: '',
            dynamicValidateForm: {
                sig: '',
                transactionID: ''
            }
        };
    },
    created() {
        this.askUserInfo();
    },
    methods: {
        askUserInfo() {
            let param = {
                trace: 'trace'
            };
            axios
                .post(this.apiUrl + '/getUserInfo', param)
                .then((response) => {
                    console.log(response.data);
                    this.table = response.data;
                    for (let i = 0; i < this.table.length; i++) {
                        console.log('this.table[i]' + this.table[i].Attributions);
                        this.table[i].Org = this.table[i].Attributions[0];
                        this.table[i].Country = this.table[i].Attributions[1];
                        this.table[i].Tel = this.table[i].Attributions[2];
                        this.table[i].Pub = this.table[i].Pub.substr(0, 40);
                        this.table[i].Email = this.table[i].Attributions[3];
                        this.table[i].Id = this.table[i].Attributions[4];

                        console.log(this.table[i]);
                    }
                })
                .catch((response) => {
                    console.log('运行报错');
                    alert(response);
                });
        },
        postData() {
            let param = {
                sig: this.dynamicValidateForm.sig,
                transactionID: this.dynamicValidateForm.transactionID
            };
            console.log(param);
            axios
                .post(this.apiUrl + '/trace', param)
                .then((response) => {
                    if (response.data.code === '200') {
                        console.log(response.data);
                        this.pubKey = response.data.Pub;
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
        getData() {
            axios
                .post(this.apiUrl + '/getAttributions')
                .then((response) => {
                    if (response.data.code === '200') {
                        this.AttributionName = response.data.Attributions;
                    }

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
