<template>
	<div class="brandStyle">
		<Table size="small" border :columns="brandColumns" :data="brandData" :loading="tableLoading">

			<template slot-scope="{ row, index }" slot="action">

				<Button v-show="!showBrand" type="primary" size="small" icon="ios-create-outline" @click="editorBrand(row)" >编辑</Button>
				<Button v-show="showBrand" type="primary" size="small" @click="getBrandInfo(row)">选择</Button>
			</template>
			
		</Table>
		<div style="overflow: hidden;padding:0.625rem 0.625rem;">
			<Button type="primary" ghost style="float: right;" @click="nextPage">下一页</Button>
			<Button type="primary" ghost style="float: right;margin-right: 0.625rem;" @click="prevPage">上一页</Button>
		</div>
		<Modal title="编辑视频品牌信息" v-model="showBrandInfo" footer-hide>
			<Icon slot="close" type="md-close"  size="30"/>
			<brand-form :brand-id="brandId" v-if="showBrandInfo">编辑</brand-form>
		</Modal>
	</div>
</template>


<script>
	import {
		brandColumns
	} from '@/data/columns.js'
	import BrandForm from '../component/brand-form.vue'
	import { getVideoBrandAccountList } from '@/api/video.js'
	export default{
		name:'brand_list',
		components:{
			BrandForm
		},
		props:{
			showBrand: {
				type: Boolean,
				default: false
			}
		},
		data(){
			return{
				brandColumns:brandColumns,
				maxId:0,
				pageSize:10,
				brandData:[],
				tableLoading:false,
				prevId: [0],
				brandId:null,
				showBrandInfo:false
			}
		},
		methods:{
			getBrandInfo(row){
				this.$emit('get-brand-info',row)
			},
			editorBrand(row){
				this.brandId = row.id
				this.showBrandInfo = true
			},
			nextPage() {
				if (this.brandData.length < this.pageSize) {
					this.$Message.warning('这是最后一页');
				} else {
					this.prevId.push(this.maxId)
					this.getBrandList()
				}
			
			},
			prevPage() {
				if (this.prevId.length > 1) {
					this.prevId.pop()
					this.maxId = this.prevId[this.prevId.length - 1]
					this.getBrandList()
				} else {
					this.$Message.warning('这是第一页');
				}
			
			},
			getBrandList(){
				this.tableLoading = true
				getVideoBrandAccountList(this.maxId,this.pageSize).then(res=>{
					this.tableLoading = false
					const data = res.data
					if(data.success ==1){
						// console.log(data)
						// this.brandData = data.videoBrandAccountList
						this.brandData = data.videoBrandAccountList.map(item => {
							// item.checkLoading = false
							// item.switchLoading = false
							if (this.maxId < item.id) {
								this.maxId = item.id
							}
							return item
						})
					}else{
						this.$Message.error(data.errorMessage)
					}
				}).catch(error=>{
					this.tableLoading = false
					alert(error)
				})
			}
		},
		mounted() {
			this.getBrandList()
		}
		
	}
</script>

<style>
</style>
