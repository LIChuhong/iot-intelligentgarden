<template>
	<div>
	<Tree ref="belongOrgTree" :data="belongOrgList" @on-select-change="changeBelongOrg" :render="renderContent" expand-node></Tree>
	</div>
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
			changeBelongOrg(val,val1) {//获取选择组织信息
			// console.log(val)
				const selectedNodes = this.$refs.belongOrgTree.getSelectedNodes();
				this.$emit('getBelongOrgInfo',selectedNodes)
			},
			renderContent(h, {root, node, data}) {
			  return h('div', {
			  }, [
			    h('span', [
			      h('Icon', {
			        props: {
			          type: ' iconfont icon-org1',
			          color: node.node.selected ? '#ff9900' : 'inherit'
			        },
			        style: {
			          marginRight: '4px',
			        },
			      }),
			      h('span', {
			        style: {
			          color: node.node.selected ? '#2d8cf0' : '#1a2846',
			          fontWeight: node.node.selected ? 'bold' : 'normal',
			        },
			        on: {
			          click: () => {
			            if (!node.node.selected) {
			              this.$refs.belongOrgTree.handleSelect(node.nodeKey);
			              // this.searchText(data.orgName);
			            }
			          },
			        }
			      }, data.orgName)]),
			  ]);
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
