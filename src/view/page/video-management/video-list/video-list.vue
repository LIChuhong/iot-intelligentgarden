<template>
	<div class="strListStyle">
		<div style="padding-bottom: 20px;">
			<Input search enter-button placeholder="请输入关键字查找" style="width: 300px" @on-search="searchVideo" />
		</div>
		<!-- <div style="height: 200px;"></div> -->
		<Table size="small" border :columns="videoColumns" :data="videoData" :loading="tableLoading">

			<template slot-scope="{ row, index }" slot="action">

				<Button icon="ios-create-outline" type="primary" size="small" style="margin-right: 8px" @click="editor(row)">编辑</Button>
				<Poptip :transfer="true" confirm title="你确定删除该视频吗?" @on-ok="del(row,index)">
					<Button icon="md-trash" type="error" size="small">删除</Button>
				</Poptip>

			</template>

		</Table>
		<div style="overflow: hidden;padding:0.625rem 0.625rem;">
			<Button type="primary" ghost style="float: right;" @click="nextPage">下一页</Button>
			<Button type="primary" ghost style="float: right;margin-right: 0.625rem;" @click="prevPage">上一页</Button>
		</div>
		<Modal title="编辑视频" v-model="showVideoInfo" footer-hide>
			<Icon slot="close" type="md-close"  size="30"/>
			<video-form :video-id="videoId" v-if="showVideoInfo">编辑</video-form>
		</Modal>
	</div>
</template>


<script>
	import {
		videoColumns
	} from '@/data/columns.js'
	import {
		getVideoList,delVideo
	} from '@/api/video.js'
	import VideoForm from '../component/video-form.vue'
	export default {
		name:'video_list',
		components:{
			VideoForm
		},
		data() {
			return {
				videoId:null,
				showVideoInfo:false,
				videoColumns: videoColumns,
				videoData: [],
				tableLoading: false,
				searchKey: '',
				maxId: 0,
				pageSize: 10,
				prevId: [0],
			}
		},
		methods: {
			searchVideo(val) {
				this.searchKey = val
				this.maxId = 0
				this.prevId = [0]
				this.getVideoDataList()
			
			},
			nextPage() {
				if (this.videoData.length <this.pageSize) {
					this.$Message.warning('这是最后一页');
				} else {
					this.prevId.push(this.maxId)
					this.getVideoDataList()
				}
			
			},
			prevPage() {
				if (this.prevId.length > 1) {
					this.prevId.pop()
					this.maxId = this.prevId[this.prevId.length - 1]
					this.getVideoDataList()
				} else {
					this.$Message.warning('这是第一页');
				}
			
			},
			editor(row){
				this.videoId = row.id
				this.showVideoInfo = true
			},
			del(row, index) {
				this.tableLoading = true
				delVideo(row.id).then(res => {
					const data = res.data
					this.tableLoading = false
					if (data.success == 1) {
						this.videoData.splice(index, 1);
						this.$Message.success('删除成功')
					} else {
						this.$Message.error(data.errorMessage)
					}
				
				}).catch(error => {
					this.tableLoading = false
					alert(error)
				})
			},
			getVideoDataList() {
				this.tableLoading = true
				getVideoList(this.searchKey, this.maxId, this.pageSize).then(res => {
					this.tableLoading = false
					const data = res.data
					if (data.success == 1) {
						// console.log(data)
						// this.videoData = data.videoList
						this.videoData = data.videoList.map(item => {
							// item.checkLoading = false
							// item.switchLoading = false
							if (this.maxId < item.id) {
								this.maxId = item.id
							}
							return item
						})
					} else {
						this.$Message.error(data.errorMessage)
					}
				}).catch(error => {
					this.tableLoading = false
					alert(error)
				})
			}
		},

		mounted() {
			this.getVideoDataList()
		}
	}
</script>

<style>
</style>
