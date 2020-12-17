<template>
  <Form ref="loginForm" :model="form" :rules="rules" @keydown.enter.native="handleSubmit">
    <FormItem prop="userName">
      <Input v-model="form.userName" placeholder="请输入用户名" @on-focus="focus('userName')">
        <span slot="prepend">
          <Icon :size="16" type="ios-person"></Icon>
        </span>
      </Input>
    </FormItem>
    <FormItem prop="password">
      <Input type="password" v-model="form.password" placeholder="请输入密码" @on-focus="focus('pwd')">
        <span slot="prepend">
          <Icon :size="14" type="md-lock"></Icon>
        </span>
      </Input>
    </FormItem>
		<!-- <FormItem prop="verCode">
		  <Input v-model="form.verCode" placeholder="请输入验证码">
		    <div slot="append" @click="changeCode">
					 <img ref="verCodeRef" :src="verCodeSrc" alt="" width="60px" height="20px">
		    </div>
		  </Input>
		</FormItem> -->
    <FormItem>
      <Button @click="handleSubmit" type="primary" long>登录</Button>
    </FormItem>
  </Form>
</template>
<script>
export default {
  name: 'LoginForm',
  props: {
    userNameRules: {
      type: Array,
      default: () => {
        return [
          { required: true, message: '账号不能为空', trigger: 'blur' }
        ]
      }
    },
    passwordRules: {
      type: Array,
      default: () => {
        return [
          { required: true, message: '密码不能为空', trigger: 'blur' }
        ]
      }
    },
		// verCodeRules:{
		// 	type:Number,
		// 	default: () => {
		// 	  return [
		// 	    { required: true, message: '验证码不能为空', trigger: 'blur' }
		// 	  ]
		// 	}
		// }
  },
  data () {
    return {
			//verCodeSrc:this.$config.baseUrl.dev+'/verifycode?from=3',
      form: {
        userName: 'zrwladmin',
        password: '123',
				verCode:''
      }
    }
  },
  computed: {
    rules () {
      return {
        userName: this.userNameRules,
        password: this.passwordRules,
				//verCode: this.verCodeRules
      }
    }
  },
  methods: {
		focus(val){
			this.$emit('on-focus',val)
		},
		changeCode(){
		//alert(this.$config. baseUrl.dev)
			this.verCodeSrc = this.$config.baseUrl.dev+'/verifycode?from=3&rend='+Math.random()
			
		},
    handleSubmit () {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.$emit('on-success-valid', {
            userName: this.form.userName,
            password: this.form.password,
						verCode:this.form.verCode
          })
        }
      })
    }
  }
}
</script>
