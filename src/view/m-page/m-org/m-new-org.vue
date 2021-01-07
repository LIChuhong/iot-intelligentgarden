<template>
	<div>
		<org-form style="width: 90%;margin: 0.625rem auto;">{{$t('add')}}</org-form>
	</div>
</template>

<script>
	import OrgForm from '@/view/page/org-management/component/org-form.vue'
	export default{
		name:'m_new_org',
		components:{
			OrgForm
		},
		data(){
			return{
				
			}
		}
	}
</script>

<style>
</style>