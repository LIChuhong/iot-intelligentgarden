<template>
	<div>
		<Form ref="brandForm" :model="brandForm" :rules="brandRule" :label-width="90" :label-colon="true" label-position="left">
			<FormItem label="品牌名称" prop="brandName">
				<Input :maxlength="20" type="text" v-model="brandForm.brandName" placeholder="请输入品牌名称">
				</Input>
			</FormItem>
			<FormItem label="品牌标识" prop="brandTag">
				<Input :maxlength="10" type="text" v-model="brandForm.brandTag" placeholder="请输入品牌标识">
				</Input>
			</FormItem>
			<FormItem label="应用ID" prop="appKey">
				<Input :maxlength="100" type="text" v-model="brandForm.appKey" placeholder="请输入应用ID">
				</Input>
			</FormItem>

			<FormItem label="应用密钥" prop="secret">
				<Input :maxlength="100" type="text" v-model="brandForm.secret" placeholder="请输入应用密钥">
				</Input>
			</FormItem>

			<FormItem label="所属组织" prop="belongOrgId">
				<Input readonly v-model="belongOrgName" search :enter-button="$t('choose')" placeholder="请选择所属组织"
				 @on-search="showBelongOrgList"></Input>

			</FormItem>
			<FormItem style="text-align:center;">
				<Button @click="handleReset('brandForm')" style="margin-right:0.625rem">{{$t('reset')}}</Button>
				<Button type="primary" @click="handleSubmit('brandForm')">
					<slot></slot>
				</Button>
			</FormItem>
		</Form>
		<Modal :title="'当前选择:'+ belongOrgTitle" v-model="showBelongOrg">
			<Icon slot="close" type="md-close"  size="30"/>
			<div class="tree-style">
				<org-tree v-if="showBelongOrg" @getBelongOrgInfo="showBelongOrgInfo" :orgTypeId="null"></org-tree>
			</div>
			<div slot="footer">
				<Button type="primary" size="large" @click="belongOrgOk">{{$t('ok')}}</Button>
			</div>
		</Modal>
		<Spin fix v-show="showSpin">
			<Icon type="ios-loading" size=18 class="demo-spin-icon-load"></Icon>
			<div>加载中...</div>
		</Spin>
	</div>
</template>

<script>
	import OrgTree from '@/view/components/org-tree.vue'
	import { addVideoBrandAccount,getVideoBrandAccount,updateVideoBrandAccount } from '@/api/video.js'
	
	export default {
		name: 'brand_form',
		props:['brandId'],
		components: {
			OrgTree
		},
		data() {
			return {
				showSpin:false,
				showBelongOrg: false,
				belongOrgTitle: '',
				belongOrgName: '', //所属组织名称
				belongOrgInfo: '', //所属组织信息
				brandForm: {
					brandName:'',
					brandTag:'',
					appKey:'',
					secret:'',
					belongOrgId:''
					
				},
				brandRule: {
					brandName: [{
						required: true,
						message: '品牌名称不能为空',
						trigger: 'blur'
					}],
					brandTag: [{
						required: true,
						message: '品牌标识不能为空',
						trigger: 'blur'
					}],
					appKey: [{
						required: true,
						message: '应用ID不能为空',
						trigger: 'blur'
					}],
					secret: [{
						required: true,
						message: '应用密钥不能为空',
						trigger: 'blur'
					}],
					belongOrgId: [{
						required: true,
						type: 'number',
						message: '请选择用户所属组织',
						trigger: 'change'
					}],
				}
				

			}
		},
		methods: {
			handleReset(name) {
				this.$refs[name].resetFields()
				this.belongOrgName = ''
				this.dataForm.defalutVideoName = ''
			},
			getBrandInfo(){
				if(this.brandId != null && this.brandId != ''){
					this.showSpin = true
					getVideoBrandAccount(this.brandId).then(res=>{
						const data = res.data
						this.showSpin = false
						if(data.success == 1){
							const videoBrandAccount = data.videoBrandAccount
							this.brandForm = {
								brandName:videoBrandAccount.brandName,
								brandTag:videoBrandAccount.brandTag,
								appKey:videoBrandAccount.appKey,
								secret:videoBrandAccount.secret,
								belongOrgId:videoBrandAccount.belongOrgId
							}
							this.belongOrgName = videoBrandAccount.orgName
						}else{
							this.$Message.error(data.errorMessage);
						}
					}).catch(error=>{
						this.showSpin = false
						alert(error)
					})
				}
			},
			handleSubmit(name) {
				this.$refs[name].validate((valid) => {
					if (valid) {
						//this.$Message.success('Success!');
						const videoBrandAccount ={
							brandName:this.brandForm.brandName,
							brandTag:this.brandForm.brandTag,
							appKey:this.brandForm.appKey.trim(),
							secret:this.brandForm.secret.trim(),
							belongOrgId:this.brandForm.belongOrgId,
							}
						this.showSpin = true
						if(this.brandId != null && this.brandId != ''){
							videoBrandAccount.id = this.brandId
							updateVideoBrandAccount(videoBrandAccount).then(res => {
								const data = res.data
								this.showSpin = false
								if (data.success == 1) {
									this.$Message.success('编辑成功');
										
								} else {
									this.$Message.error(data.errorMessage);
								}
							}).catch(error => {
								this.showSpin = false
								alert(error)
							})
						}else{
							addVideoBrandAccount(videoBrandAccount).then(res => {
								const data = res.data
								this.showSpin = false
								if (data.success == 1) {
									this.$Message.success('添加成功');
										
								} else {
									this.$Message.error(data.errorMessage);
								}
							}).catch(error => {
								this.showSpin = false
								alert(error)
							})
						}
						
			
						//console.log(this.vmUser)
					} else {
						//this.$Message.error('Fail!');
					}
				})
			},
			
			showBelongOrgList() { //显示所属组织列表
				this.belongOrgTitle = this.belongOrgName
				this.showBelongOrg = true

			},
			showBelongOrgInfo(data) { //显示所选所属组织信息
				this.belongOrgInfo = data
				this.belongOrgTitle = data[0].orgName
			},
			belongOrgOk() { //确定所属组织
				//const selectedNodes = this.$refs.belongOrgTree.getSelectedNodes();
				this.brandForm.belongOrgId = this.belongOrgInfo[0].id
				this.belongOrgName = this.belongOrgInfo[0].orgName
				this.showBelongOrg = false
			},
		},
		mounted() {
			this.getBrandInfo()
		}
	}
</script>

<style>
</style>
