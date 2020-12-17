<template>
	<link-form class="linkFormStyle">添加</link-form>
</template>


<script>
	import LinkForm from '../component/link-form.vue'
	export default{
		components:{
			LinkForm
		},
		data(){
			return{
				linkForm:{
					linkageName:'',
					linkageType:'',
					linkageRtuNumber:'',
					linkageParameterId:'',
					parameterMaxValue:'',
					parameterMinValue:'',
					tips:''
				}
			}
		}
	}
</script>

<style>
	.linkFormStyle{
		width: 50%;margin:  0 auto;
	}
	@media screen and (min-width:300px) and (max-width:900px) {
		.linkFormStyle{
			width: 90%;margin:  0.625rem auto;
		}
	}
</style>
