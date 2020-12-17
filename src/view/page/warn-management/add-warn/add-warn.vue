<template>
	<!-- <div>添加告警</div> -->
	<warn-from class="addWarnStyle">添加</warn-from>
</template>

<script>
	import WarnFrom from '../component/warn-form.vue'
	export default{
		components:{
			WarnFrom
		},
		data(){
			return{
				
			}
		}
	}
</script>

<style>
	.addWarnStyle{
		width: 50%;margin: 0 auto;
	}
	@media screen and (min-width:300px) and (max-width:900px) {
		.addWarnStyle {
			width: 90%;
			margin: 0.625rem auto;
			/* margin: 0 auto; */
		}
	}
</style>
