<template>
	<Tree ref="belongOrgTree" :data="belongOrgList" @on-select-change="changeBelongOrg"></Tree>
</template>

<script>
	import {
		getOrgChildrenList,getVMOrgChildrenList
	} from '@/api/org.js'
	export default{
		props:['orgTypeId'],
		data(){
			return{
				belongOrgList:[]//组织书结构列表
			}
		},
		methods:{
			changeBelongOrg(val) {//获取选择组织信息
				const selectedNodes = this.$refs.belongOrgTree.getSelectedNodes();
				this.$emit('getBelongOrgInfo',selectedNodes)
			},
		},
		created() {
			if(this.orgTypeId != null && this.orgTypeId != ''){
				getVMOrgChildrenList(this.orgTypeId).then(res=>{//获取组织结构列表
					this.belongOrgList = []
					const data =res.data
					if(data.success == 1){
						const org = data.org
						org.expand = true
						this.belongOrgList.push(org)
					}else{
						this.$Message.error(data.Message);
					}
				}).catch(error => {
					alert(error)
				})
			}else{
				getOrgChildrenList().then(res=>{//获取组织结构列表
					this.belongOrgList = []
					const data =res.data
					if(data.success == 1){
						const org = data.org
						org.expand = true
						this.belongOrgList.push(org)
						console.log(this.belongOrgList)
					}else{
						this.$Message.error(data.Message);
					}
				}).catch(error => {
					alert(error)
				})
			}
			
		}
		
		
	}
</script>

<style>
</style>
