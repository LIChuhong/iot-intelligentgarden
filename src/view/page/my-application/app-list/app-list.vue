<template>
	<div>
		<div style="padding-bottom: 20px;">
			<Input search enter-button placeholder="请输入关键字查找" style="width: 300px" @on-search="searchStrategy" />
		</div>
		<Table size="small" border :columns="appColumns" :data="appData" :loading="tableLoading">

			<template slot-scope="{ row, index }" slot="action">
				<Button icon="ios-create-outline" type="primary" size="small" style="margin-right: 8px" @click="editor(row)">{{$t('editor')}}</Button>

			</template>

		</Table>
		<div style="overflow: hidden;padding:0.625rem 0.625rem;">
			<Button type="primary" ghost style="float: right;" @click="nextPage">{{$t('next_page')}}</Button>
			<Button type="primary" ghost style="float: right;margin-right: 0.625rem;" @click="prevPage">{{$t('previous_page')}}</Button>
		</div>
		<Modal title="编辑应用" v-model="showAppInfo" footer-hide>
			<Icon slot="close" type="md-close"  size="30"/>
			<app-form style="width: 90%; margin:0 auto;" :user-id="userId" v-if="showAppInfo">{{$t('editor')}}</app-form>
		</Modal>
	</div>
</template>

<script>
	import {
		appColumns
	} from '@/data/columns.js'
	import {
		getAppCheckList
	} from '@/api/application.js'
	import AppForm from '../component/app-form.vue'
	export default {
		components:{
			AppForm
		},
		data() {
			return {
				userId:null,
				showAppInfo:false,
				appColumns: appColumns,
				appData: [],
				searchKey:'',
				maxId:0,
				pageSize:10,
				prevId: [0],
				tableLoading:false
			}
		},
		methods: {
			editor(row){
				this.userId = row.userId
				this.showAppInfo = true
			},
			nextPage() {
				if (this.appData.length <this.pageSize) {
					this.$Message.warning('这是最后一页');
				} else {
					this.prevId.push(this.maxId)
					this.getAppCheckListMethod()
				}
			
			},
			prevPage() {
				if (this.prevId.length > 1) {
					this.prevId.pop()
					this.maxId = this.prevId[this.prevId.length - 1]
					this.getAppCheckListMethod()
				} else {
					this.$Message.warning('这是第一页');
				}
			
			},
			searchStrategy(val) {
				this.searchKey = val
				this.maxId = 0
				this.prevId = [0]
				this.getAppCheckListMethod()
			},
			getAppCheckListMethod() {
				this.tableLoading = true
				getAppCheckList(this.searchKey,this.maxId,this.pageSize).then(res => {
					this.tableLoading = false
					const data = res.data
					if (data.success == 1) {
						if(data.appCheckList){
							this.appData = data.appCheckList.map(item => {
								if (this.maxId < item.id) {
									this.maxId = item.id
								}
								return item
							})
						}
					} else {
						this.$Message.error(data.errorMessage)
					}
				}).catch(error => {
					this.tableLoading = false
					alert(error)
				})
			}
		},
		mounted() {
			this.getAppCheckListMethod()
		}
	}
</script>

<style>
</style>
