<template>
	<div>
		<org-form style="width: 50%;margin: 0 auto;">{{$t('add')}}</org-form>
	</div>
</template>

<script>
	import OrgForm from '../component/org-form.vue'
	export default{
		name:'new_org',
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
