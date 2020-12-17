<template>
	<param-form class="paramStyle"> 添加 </param-form>
	
</template>


<script>
	import ParamForm from '../component/param-form.vue'
	export default {
		components:{
			ParamForm
		},
		data() {
			return {

			}
		}
	}
</script>

<style>
	.paramStyle{
		width: 60%;
		margin:  0 auto;
	}
	@media screen and (min-width:300px) and (max-width:900px) {
		.paramStyle {
			width: 90%;
			margin: 0.625rem auto;
			/* margin: 0 auto; */
		}
	}
</style>
