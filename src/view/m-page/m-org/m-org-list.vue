<template>
	<div>
		<org-list class="mOrgListStyle"></org-list>
	</div>
</template>

<script>
	import OrgList from '@/view/page/org-management/org-list/org-list.vue'
	export default{
		name:'m_org_list',
		components:{
			OrgList
		},
		data(){
			return{
				
			}
		}
	}
</script>

<style>
	@media screen and (min-width:300px) and (max-width:900px) {
		.mOrgListStyle{
			margin-top: 0.625rem;
		}
		.mOrgListStyle .ivu-modal-body {
			padding: 0;
		}
	
		.mOrgListStyle .ivu-table-cell {
			padding: 0;
			margin: 0;
		}
	}
</style>