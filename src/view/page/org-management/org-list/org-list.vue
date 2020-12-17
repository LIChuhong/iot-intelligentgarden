<template>
	<div>
		<div style="padding-bottom: 20px;">
			<Input search enter-button placeholder="请输入组织名称查找" style="width: 300px" @on-search="searchOrgName" />
		</div>
		<Table size="small" border :columns="orgListColumns" :data="orgListData" :loading="tableLoading">
			<template slot-scope="{ row }" slot="orgLogo">
				<img :src="row.orgLogoUrl" :alt="row.orgName" width="100%" />
			</template>
			<template slot-scope="{ row, index }" slot="action">
				<Button v-if="$store.state.app.iotInterFace == 0" icon="ios-create-outline" type="primary" size="small" style="margin-right: 15px" @click="show_org_info(row,index)">编辑</Button>
				<Button v-else icon="ios-create-outline" type="primary" size="small" @click="show_org_info(row,index)"></Button>
				<!-- <Button icon="ios-create-outline" :type="row.isEnableColor" size="small" style="margin-right: 10px" @click="setIsEnbleOrg(row,index)">{{row.isEnableTip}}</Button> -->
				<i-switch v-if="$store.state.app.iotInterFace == 0" :loading="row.switchLoading" :disabled="row.buttonDis" v-model="row.isEnable" @on-change="setIsEnbleOrg(row)"></i-switch>

			</template>
		</Table>
		<div style="overflow: hidden;padding:0.625rem 0.625rem;">
			<Button type="primary" ghost style="float: right;" @click="nextPage">下一页</Button>
			<Button type="primary" ghost style="float: right;margin-right: 0.625rem;" @click="prevPage">上一页</Button>
		</div>
		<Modal title="编辑信息" v-model="showOrgInfo" footer-hide>
			<Icon slot="close" type="md-close"  size="30"/>
			<org-form :org-id="orgId" v-if="showOrgInfo">编辑</org-form>
		</Modal>
	</div>
</template>

<script>
	import {
		orgListColumns
	} from '@/data/columns.js'
	import {
		getOrgList,
		isEnableOrg

	} from '@/api/org'
	import OrgForm from '../component/org-form.vue'
	export default {
		name: 'org_list',
		components: {
			OrgForm
		},
		data() {
			return {
				prevId: [0],
				orgName: '',
				maxId: 0,
				pageSize: 10,
				showOrgInfo: false,
				orgId: null,
				tableLoading: false,
				orgListColumns: orgListColumns,
				orgListData: [{
					id: 1,
					orgName: '自然物联',
					orgLogo: '',
					orgType: '公司',

				}]
			}
		},
		methods: {
			show_org_info(row, index) {
				this.orgId = row.id
				this.showOrgInfo = true
			},
			
			setIsEnbleOrg(row) {
				row.switchLoading = true
				isEnableOrg(row.id, row.isEnable).then(res => {
					row.switchLoading = false
					const data = res.data
					if (data.success == 1) {
						if (row.isEnable) {
							this.$Message.success('组织启用成功')
						} else {
							this.$Message.success('组织禁用成功')
						}
					} else {
						this.$Message.error( data.errorMessage)
					}
				console.log(this.orgListData)
				}).catch(error => {
					row.switchLoading = false
					alert(error)
				})
			},
			
			
			showOrgList() {
				this.tableLoading = true
				getOrgList(this.orgName, this.maxId, this.pageSize).then(res => {
					const data = res.data
					this.tableLoading = false
					if (data.success == 1) {
						// console.log(data)
						if (data.iaOrgList != null) {

							this.showOrg(data.iaOrgList)
						}
					} else {
						this.$Message.error(data.errorMessage)
					}
					//this.orgListTableData = data.orgList
				})
			},
			showOrg(orgList) {
				this.orgListData = orgList.map(item=>{
					if (this.maxId <= item.id) {
						this.maxId = item.id
					}
					if (item.id == 1) {
						item.buttonDis = true
					} else {
						item.buttonDis = false
					}
					item.switchLoading = false
					return item
				})
				
			},
			nextPage() {
				if (this.orgListData.length < this.pageSize) {
					this.$Message.warning('这是最后一页');
				} else {
					//console.log(this.maxId)
					this.prevId.push(this.maxId)
					//console.log(this.prevId)
					this.showOrgList()
					//console.log(this.maxId)
				}
			
			},
			searchOrgName(orgName){
				this.orgName = orgName
				this.maxId = 0
				this.prevId= [0]
				this.showOrgList()
			},
			prevPage() {
				if (this.prevId.length > 1) {
					this.prevId.pop()
					this.maxId = this.prevId[this.prevId.length - 1]
					this.showOrgList()
				} else {
					this.$Message.warning('这是第一页');
				}
			
			},

		},
		created() {
			this.showOrgList()
		}

	}
</script>

<style>
</style>
