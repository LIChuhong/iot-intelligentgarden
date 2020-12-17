<template>
	
	<plot-form class="plotStyle">添加</plot-form>
	
</template>

<script>
	import PlotForm from '../component/plot-form.vue'
	export default{
		components:{
			PlotForm
		},
		data(){
			return{
				
			}
		}
	}
</script>

<style>
	.plotStyle{
		width: 60%;
		margin:  0 auto;
	}
	@media screen and (min-width:300px) and (max-width:900px) {
		.plotStyle {
			width: 90%;
			margin: 0.625rem auto;
			/* margin: 0 auto; */
		}
	}
</style>
