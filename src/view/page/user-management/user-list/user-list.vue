<template>
	<div>
		<div style="overflow: hidden;padding-bottom: 8px;">
			<Input search enter-button placeholder="请输入用户名关键字" @on-search="findUserList" style="width:300px;float: left;" />
		</div>
		<Table :loading="userTableLoading" size="small" border :columns="userColumns" :data="userListData">
			<template slot-scope="{ row, index }" slot="userHeadImgUrl">
				<img :src="row.userHeadImgUrl" width="50px" />
			</template>
			<template slot-scope="{ row, index }" slot="action">
				<Button type="primary" size="small" icon="ios-create-outline" @click="editorUser(row)" style="margin-right: 8px;">{{$t('editor')}}</Button>
				<Button type="success" icon="ios-key" size="small" @click="resetPassword(row)">{{$t('change')+$t('password')}}</Button>
			</template>
		</Table>
		<div style="overflow: hidden;padding:0.625rem 0.625rem;">
			<Button type="primary" ghost style="float: right;" @click="nextPage">{{$t('next_page')}}</Button>
			<Button type="primary" ghost style="float: right;margin-right: 0.625rem;" @click="prevPage">{{$t('previous_page')}}</Button>
		
		</div>
		<Modal v-model="showUserEditor" title="编辑用户信息" footer-hide>
			<Icon slot="close" type="md-close"  size="30"/>
			<user-form v-if="showUserEditor" :user-id="userId">{{$t('editor')}}</user-form>
		</Modal>
		<Modal title='修改密码' v-model="showPwd" footer-hide>
			<Icon slot="close" type="md-close"  size="30"/>
			<reset-pwd v-if="showPwd" :user-id="userId"></reset-pwd>
		</Modal>
	</div>
</template>

<script>
	import {
		userListColumns
	} from '@/data/columns.js'
	import {
		timestampToTime
	} from '@/libs/tools'
	import {
		getUserList
	} from '@/api/user'
	import UserForm from '../components/user-form.vue'
	import ResetPwd from '../components/reset-pwd.vue'
	export default{
		name:'user_list',
		components:{
			UserForm,
			ResetPwd
		},
		data(){
			return{
				showUserEditor:false,
				prevId: [0],
				userTableLoading:false,
				userColumns:userListColumns,
				userListData:[{
					userId:1,
					userName:'张三',
					userHeadImgUrl:'',
					realName:'李四',
					userLevelName:'管理员',
					createTime:'2020-05-20 13:14',
				}],
				userId:null,
				searchKey:'',
				maxId:0,
				pageSize:10,
				showPwd:false,
			}
		},
		methods:{
			resetPassword(row){
				this.userId = row.id
				this.showPwd = true
			},
			editorUser(row) {
				this.userId = row.id
				this.showUserEditor = true
			
			},
			findUserList(searchKey) {
				this.searchKey = searchKey
				this.maxId = 0
				this.prevId = [0]
				this.getUserList()
			
			},
			getUserList() {
				this.userTableLoading = true
				getUserList(this.searchKey, this.maxId, this.pageSize).then(res => {
					this.userTableLoading = false
					const data = res.data
					if (data.success == 1) {
						this.userListData = data.userList.map(item => {
							if (this.maxId < item.id) {
								this.maxId = item.id
							}
							item.createTime = timestampToTime(item.createTime)
							return item
						})
			
						//this.userList = data.userList
					} else {
						this.$Message.error(data.Message);
					}
				}).catch(error => {
					this.userTableLoading = false
					alert(error)
				})
			
			},
			
			nextPage() {
				if (this.userListData.length < this.pageSize) {
					this.$Message.warning('这是最后一页');
				} else {
					this.prevId.push(this.maxId)
					this.getUserList()
				}
			
			},
			
			prevPage() {
				if (this.prevId.length > 1) {
					this.prevId.pop()
					this.maxId = this.prevId[this.prevId.length - 1]
					this.getUserList()
				} else {
					this.$Message.warning('这是第一页');
				}
			
			},
		},
		created() {
			// this.$route.meta.keepAlive = true
		
			this.getUserList()
		}
	}
</script>

<style>
	
</style>
