<template>
	<div style="width: 50%;margin: 0 auto;">
		<rtu-form>{{$t('add')}}</rtu-form>
	</div>
</template>

<script>
	import RtuForm from '../component/rtu-form.vue'
	export default{
		name:'new_rtu',
		components:{
			RtuForm
		},
		data(){
			return{
				
			}
		}
	}
</script>

<style>
</style>
