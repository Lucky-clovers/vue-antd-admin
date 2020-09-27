<template>
    <div class="ai-register-main">
        <h3>注册</h3>
        <a-form @submit="handleSubmit" :form="form">
            <a-form-item>
                <a-input placeholder="邮箱" size="large"
                         v-decorator="['email', { rules: [{ required: true, message: '请输入邮箱地址!' }] }]">
                <a-icon slot="prefix" type="mail" />
                </a-input>
            </a-form-item>
            <a-popover placement="rightTop" v-model="visible">
                <div style="padding: 4px 0;width:240px;" slot="content">
                    <div v-show="passwordStatus==='ok'" class="success">强度：强</div>
                    <div v-show="passwordStatus==='pass'" class="warning">强度：中</div>
                    <div v-show="passwordStatus==='poor'" class="error">强度：太短</div>
                    <div :class="`progress-${passwordStatus}`">
                        <a-progress :status="passwordProgressStatus" class="progress" :strokeWidth="6"
                                    :percent="passwordProgressPercent" :showInfo="false"/>
                    </div>
                    <div style="marginTop: 10">
                        请至少输入 6 个字符。请不要使用容易被猜到的密码。
                    </div>
                </div>
                <a-form-item :help="help">
                    <a-input type="password" autocomplete placeholder="至少6位密码，区分大小写" size="large" v-decorator="['password', {rules: [
                                            { validator: this.checkPassword }
                                            ]}]">
                    <a-icon slot="prefix" type="lock" />
                    </a-input>
                </a-form-item>
            </a-popover>
            <a-form-item>
                <a-input type="password" autocomplete placeholder="确认密码" size="large" v-decorator="['confirm', {rules: [
                                            { required: true, message: '请确认密码！', },
                                            { validator: this.checkConfirm, },
                                            ]}]">
                    <a-icon slot="prefix" type="lock" />
                </a-input>
            </a-form-item>
            <a-form-item>
                <a-input placeholder="11位手机号" size="large" v-decorator="['mobile', {rules: [
                                            { required: true, message: '请输入手机号！' },
                                            ]}]">
                    <a-icon slot="prefix" type="mobile" />

                    <a-select slot="addonBefore" defaultValue="+86" style="width: 90px">
                        <a-select-option value="86">+86</a-select-option>
                        <a-select-option value="87">+87</a-select-option>
                    </a-select>
                </a-input>
            </a-form-item>
            <a-form-item>
                <a-row :gutter="8">
                    <a-col :span="16">
                        <a-input placeholder="验证码 4569" size="large"
                                 v-decorator="['captcha', {rules: [{ required: true, message: '请输入验证码! ' }]}]">
                            <a-icon  slot="prefix" type="safety-certificate" />
                        </a-input>
                    </a-col>
                    <a-col :span="8">
                        <a-send-captcha-button v-model="start" @click="send" :second="120" class="getCaptcha"
                                               storageKey="SendCaptchaStorageRegisterKey" size="large"/>
                    </a-col>
                </a-row>
            </a-form-item>
            <a-form-item>

                <a-button  :loading="logging" size="large" class="submit" type="primary" htmlType="submit">
                    注册
                </a-button>
                <router-link class="login" to="/login">使用已有账户登录</router-link>
            </a-form-item>
        </a-form>
    </div>
</template>

<script>
    import {Register} from '@/services/user'
    import SendCaptchaButton from "@/components/SendCaptchaButton";

    export default {
        name: "ai-register",
        data() {
            return {
                logging: false,
                visible: false,
                help: "",
                passwordStatus: "poor",
                start: false,
                passwordProgressPercent: 0,
                passwordProgressStatus: "active",
                form: this.$form.createForm(this)
            }
        },
        components: {
            ASendCaptchaButton: SendCaptchaButton,
        },
        methods: {
            checkPassword(rule, value, callback) {
                if (!value) {
                    this.help = "请输入密码！";
                    this.visible = !!value;
                    callback("error");
                } else {
                    this.passwordProgressPercent =
                        value.length * 10 > 100 ? 100 : value.length * 10;
                    if (value && value.length > 5) {
                        this.passwordStatus = "pass";
                        this.passwordProgressStatus = "active";
                    }
                    if (value && value.length > 9) {
                        this.passwordStatus = "ok";
                        this.passwordProgressStatus = "success";
                    }
                    if (value && value.length < 6) {
                        this.passwordStatus = "poor";
                        this.passwordProgressStatus = "exception";
                    }
                    this.help = "";
                    if (!this.visible) {
                        this.visible = !!value;
                    }
                    if (value.length < 6) {
                        callback("error");
                    } else {
                        callback();
                    }
                }
            },
            checkConfirm(rule, value, callback) {
                if (value && value !== this.form.getFieldValue("password")) {
                    callback("两次输入的密码不匹配!");
                } else {
                    callback();
                }
            },
            handleSubmit(e) {
                e.preventDefault()
                this.form.validateFields((err,values) => {
                    if (!err) {
                        this.logging = true
                        console.log('Received values of form: ', values);
                        Register(values).then(this.afterRegister)
                    }
                })
            },
            afterRegister(res){
                console.log(res)
                this.logging = false
                const registerRes = res.data
                if (registerRes.code == 200) {
                    this.$message.warning(registerRes.message)
                    this.$router.push({ path: '/login' })

                } else {
                    this.$message.warning(registerRes.message)
                }
            },
            send() {
                new Promise((resolve, reject) => {
                    this.form.validateFields(["mobile"], {}, (err) => {
                        if (err) {
                            reject(err);
                        } else {
                            this.$message.loading("Action in progress..", 0);
                            setTimeout(() => {
                                this.start = true;
                                this.$message.destroy();
                                this.$message.success("This is a message of success code [ 4569 ]", 10);
                            }, 1000);
                        }
                    });
                });
            }
        }
    };
</script>
<style lang="less">

    .ai-register-main {
        width: 368px;
        margin: 0 auto;

        :global {
            .ant-form-item {
                margin-bottom: 24px;
            }
        }

        h3 {
            font-size: 16px;
            margin-bottom: 20px;
            text-align: left;
        }

        .getCaptcha {
            display: block;
            width: 100%;
        }

        .submit {
            float: left;
            width: 50%;
        }

        .login {
            float: right;
            line-height: @btn-height-lg;
        }

        .ant-form-explain {
            margin-top: 0px;
        }
    }

    .success,
    .warning,
    .error {
        transition: color 0.3s;
    }

    .success {
        color: @success-color;
    }

    .warning {
        color: @warning-color;
    }

    .error {
        color: @error-color;
    }

    .progress-pass > .progress {
        :global {
            .ant-progress-bg {
                background-color: @warning-color;
            }
        }
    }

</style>