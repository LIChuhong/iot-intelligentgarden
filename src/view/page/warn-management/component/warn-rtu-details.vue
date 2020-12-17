<template>
	<div class="warnRtuDetailsStyle">
		<Table size="small" border :columns="wRDetailsColumns" :data="wRDetailsData" :loading="tableLoading">
		
			<template slot-scope="{ row, index }" slot="action" >
				<Poptip placement="left" :transfer="true" confirm title="你确定删除该参数关联吗?" @on-ok="del(row,index)">
				<Button icon="md-trash" type="error" size="small" ></Button>
				</Poptip>
			</template>
		</Table>
	</div>
</template>

<script>
	// import 
	import {
		wRDetailsColumns
	} from '@/data/columns.js'
	import {
		getRtuParamWarnRelDetList,updateRtuParamWarnRelList
	} from '@/api/warn.js'
	export default{
		props:['rtuNumber'],
		data(){
			return{
				tableLoading:false,
				wRDetailsColumns:wRDetailsColumns,
				wRDetailsData:[{}]
			}
		},
		methods:{
			del(row,index){
				this.tableLoading = true
				this.wRDetailsData.splice(index, 1)
				var list = []
				var wRDetailsData = this.wRDetailsData
				for(var i = 0 ;i< wRDetailsData.length;i++){
					if(wRDetailsData[i].parameterId != '' && wRDetailsData[i].parameterWarnId != null){
						list.push({
							parameterId: wRDetailsData[i].parameterId,
							parameterWarnId: wRDetailsData[i].parameterWarnId
						})
					}
				}
				var rtuParameterWarnRelationList = {
					rtuNumber:this.rtuNumber,
					parameterWarnRelationList: list
				}
				updateRtuParamWarnRelList(rtuParameterWarnRelationList).then(res=>{
					const data = res.data
					this.tableLoading = false
					if(data.success == 1){
						
						this.$Message.success('删除成功')
					}else{
						this.$Message.error(data.errorMessage)
					}
				}).catch(error=>{
					this.tableLoading = false
					alert(error)
				})
				
			},
			getWRDetails(){
				getRtuParamWarnRelDetList(this.rtuNumber).then(res=>{
					const data = res.data
					if(data.success == 1){
						 console.log(data)
						this.wRDetailsData = data.parameterWarnRelationDetailsList
					}else{
						this.$Message.error(data.errorMessage)
					}
				}).catch(error=>{
					alert(error)
				})
			}
		},
		created() {
			if(this.rtuNumber != null){
				this.getWRDetails()
			}
		}
	}
</script>

<style>
	@media screen and (min-width:300px) and (max-width:900px) {
		/* .warnRtuStyle {
			margin-top: 0.625rem;
		} */
		.warnRtuDetailsStyle .inputStyle{
			width: 60%;
		}
	
		.warnRtuDetailsStyle .ivu-modal-body {
			padding: 0;
		}
	
		.warnRtuDetailsStyle .ivu-table-cell {
			padding: 0;
			margin: 0;
		}
	}
</style>
