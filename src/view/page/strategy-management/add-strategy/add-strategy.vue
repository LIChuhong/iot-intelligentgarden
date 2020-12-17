<template>
	<strategy-form class="strategyStyle">添加</strategy-form>
</template>

<script>
	import StrategyForm from '../component/strategy-form.vue'
	export default{
		name:'add_strategy',
		components:{
			StrategyForm
		},
		data(){
			return{
				
			}
		}
	}
</script>

<style>
	.strategyStyle{
		width: 60%;
		margin:  0 auto;
	}
	@media screen and (min-width:300px) and (max-width:900px) {
		.strategyStyle {
			width: 90%;
			margin: 0.625rem auto;
			/* margin: 0 auto; */
		}
	}
</style>
