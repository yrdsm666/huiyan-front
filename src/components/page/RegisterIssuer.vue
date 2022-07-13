<template>
    <div>
        <el-card class="box-card" style="height: 870px">
            <div slot="header" class="clearfix">
                <span style="font-size: 24px">初始化CA</span>
            </div>
            <div class="text item">
                <div slot="header" class="clearfix">
                    <el-row :gutter="20">
                        <el-col :span="9">
                            <div class="grid-content bg-purple" style="width:600px">
                                <div id="app">
                                    <el-form
                                        :model="dynamicValidateForm"
                                        ref="dynamicValidateForm"
                                        label-width="100px"
                                        class="demo-dynamic"
                                    >
                                        <el-form-item
                                            label="随机种子"
                                            :rules="[
                                                { required: true, message: '请输入随机种子', trigger: 'blur' },
                                                { message: '请输入随机种子', trigger: ['blur', 'change'] }
                                            ]"
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
                                            :label="'属性名' + index"
                                            :key="domain.key"
                                            :prop="'domains.' + index + '.value'"
                                            :rules="{ required: true, message: '属性不能为空', trigger: 'blur' }"
                                        >
                                            <el-row :gutter="20">
                                                <el-col :span="19">
                                                    <el-input v-model="domain.value"></el-input>
                                                </el-col>
                                                <el-col :span="4">
                                                    <el-button @click.prevent="removeDomain(domain)">删除</el-button>
                                                </el-col>
                                            </el-row>
                                        </el-form-item>
                                        <el-form-item>
                                            <el-button type="primary" @click="submitForm('dynamicValidateForm')">初始化CA</el-button>
                                            <el-button @click="addDomain">新增属性</el-button>
                                            <el-button @click="askCAInfo">现有秘钥</el-button>
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
        <el-dialog title="Issuer秘钥" :visible.sync="dialogVisible" width="30%" center>
            <el-input type="textarea" :rows="21" v-model="issuerKey"> </el-input>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog title="Issuer秘钥" :visible.sync="keyVisible" width="30%" center>
            <el-input type="textarea" :rows="21" v-model="issuerKey"> </el-input>
            <span slot="footer" class="dialog-footer">
                <el-button @click="keyVisible = false" >取 消</el-button>
                <el-button type="primary" @click="keyVisible = false">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import axios from 'axios';
import { messages } from '@/components/common/i18n';

export default {
    data() {
        return {
            keyVisible: false,
            dialogVisible: false,
            issuerPubKey: '',
            issuerPriKey: '',
            issuerKey: '无秘钥，请初始化后再查看',
            dynamicValidateForm: {
                domains: [
                    {
                        value: '组织'
                    },
                    {
                        value: '地点'
                    },
                    {
                        value: '电话'
                    },
                    {
                        value: '邮箱'
                    },
                    {
                        value: '统一识别码'
                    }
                ],
                sed: 32
            }
        };
    },
    methods: {
        getData(data) {
            console.log('发送的值：' + data);
            axios
                .post(this.apiUrl + '/initIssuer', data)
                // .post('http://10.130.157.175:8080/initIssuer', data)
                .then((response) => {
                    if (response.data.code === '200') {
                        this.issuerPriKey = response.data.Pri;
                        this.issuerPubKey = response.data.Pub;
                        this.issuerKey = '_________公钥_________\n' + this.issuerPubKey + '\n_________私钥_________\n' + this.issuerPriKey;
                        this.dialogVisible = true;
                        this.$message({
                            message: '用时：' + response.data.Spend / 1000000 + '（毫秒）',
                            duration: 0,
                            showClose: true
                        });
                    }
                })
                .catch((response) => {
                    this.dialogVisible = true;
                    this.issuerKey = '初始化失败，请联系管理员';
                });
        },

      askCAInfo() {

        let param = {
          user: "CA"
        };

        axios
            .post(this.apiUrl + '/getUserInfo', param)
            .then((response) => {
               console.log(response.data)
                this.issuerPriKey = response.data.Pri;
                this.issuerPubKey = response.data.Pub;
                this.issuerKey = '_________公钥_________\n' + this.issuerPubKey + '\n_________私钥_________\n' + this.issuerPriKey;
                this.dialogVisible = true;
                this.$message({
                  message: '用时：' + response.data.Spend / 1000000 + '（毫秒）',
                  duration: 0,
                  showClose: true
                });
              this.keyVisible = true
            })
            .catch((response) => {
              console.log('获取失败');
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
        async submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    const attributions = [];
                    for (let i = 0; i < this.dynamicValidateForm.domains.length; i++) {
                        attributions[i] = this.dynamicValidateForm.domains[i].value;
                    }
                    this.getData({
                        attributions: attributions,
                        sed: this.dynamicValidateForm.sed
                    });
                } else {
                    this.$alert('请补充完成属性名称', '初始化CA', {
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
