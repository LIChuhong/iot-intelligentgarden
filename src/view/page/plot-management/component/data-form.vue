<template>
	<div>
		<Form :label-width="120" ref="dataForm" :model="dataForm" :rules="dataRule" label-position="right">

			<FormItem label="数据画面名称" prop="bigDataMapName">
				<Input type="text" :maxlength="100" v-model="dataForm.bigDataMapName" placeholder="请输入数据画面名称"></Input>
			</FormItem>
			<FormItem label="关联农场" prop="mapId">
				<Select v-model="dataForm.mapId" @on-open-change="getFarmList" placeholder="请选择关联农场">
					<Option v-for="i in farmList" :value="i.id.toString()" :key="i.id">{{ i.mapName }}</Option>
				</Select>
			</FormItem>

			<FormItem label="农场地理坐标" prop="farmPathName">
				<Input readonly v-model="dataForm.farmPathName" search enter-button="选择" placeholder="请选择农场地理坐标" @on-search="getFarmPath"></Input>
			</FormItem>


			<FormItem label="所属组织" prop="belongOrgId">
				<Input readonly v-model="belongOrgName" search enter-button="选择" placeholder="请选择所属组织" @on-search="showBelongOrgList"></Input>
			</FormItem>
			<FormItem label="种植环境" prop="farmType">
				<RadioGroup v-model="dataForm.farmType">
					<Radio v-for="item in plantEnvList" :key="item.id" :label="item.id">{{item.label}}</Radio>
				</RadioGroup>
			</FormItem>
			<FormItem label="页面刷新周期" prop="updateDataInv">
				<Select v-model="dataForm.updateDataInv" placeholder="请选择刷新时间">
					<Option v-for="i in timeList" :value="i.id" :key="i.id">{{ i.label }}</Option>
				</Select>
			</FormItem>
			<FormItem label="默认视频" prop="defalutVideoId">
				<Input readonly v-model="dataForm.defalutVideoName" search enter-button="选择" placeholder="请选择默认视频" @on-search="showVideoList"></Input>
			</FormItem>
		
			<FormItem style="text-align: center;">
				<Button @click="handleReset('dataForm')" style="margin-right: 8px">重置</Button>
				<Button type="primary" @click="handleSubmit('dataForm')">
					<slot></slot>
				</Button>

			</FormItem>
		</Form>
		<Modal title="农场地理位置" v-model="showMap" fullscreen>
			<baidu-map class="bm-map" map-type="BMAP_NORMAL_MAP" scroll-wheel-zoom :center="center" :zoom="zoom" @ready="handler"
			 @click="getPoint">
				<bm-control>
					<Input v-model="keyword" @on-search="findArea" placeholder="请输入查找地址" style="width:100%" icon="ios-search"></Input>
					<bm-geolocation anchor="BMAP_ANCHOR_BOTTOM_RIGHT" :showAddressBar="true" :autoLocation="true"></bm-geolocation>
				</bm-control>
				<!-- <bm-view class="bm-map"></bm-view> -->
				<bm-local-search :select-first-result="true" :page-capacity="5" :keyword="keyword" :auto-viewport="true" :zoom="15"
				 :location="location" :panel="false" @markersset="markersSet"></bm-local-search>
				<bm-marker :position="markerPosition" animation="BMAP_ANIMATION_BOUNCE">
				</bm-marker>
			</baidu-map>
			<template slot="footer">
				<div style="overflow: hidden;text-align: left;">
					<span>选择位置:{{markerName}}</span>
					<Button @click="changeFarmPath" type="primary" style="float: right;">
						确定
					</Button>
				</div>

			</template>
		</Modal>
		<Modal :title="'当前选择:'+ belongOrgTitle" v-model="showBelongOrg">
			<Icon slot="close" type="md-close"  size="30"/>
			<div class="tree-style">
				<org-tree v-if="showBelongOrg" @getBelongOrgInfo="showBelongOrgInfo" :orgTypeId="null"></org-tree>
			</div>
			<div slot="footer">
				<Button type="primary" size="large" @click="belongOrgOk">确定</Button>
			</div>
		</Modal>
		
		<Modal title="选择默认视频" v-model="showVideo" footer-hide>
			<Icon slot="close" type="md-close"  size="30"/>
			<video-list v-if="showVideo" @get-video-info="getVideoInfo"></video-list>
		</Modal>
		<Spin fix v-show="showSpin">
			<Icon type="ios-loading" size=18 class="demo-spin-icon-load"></Icon>
			<div>加载中...</div>
		</Spin>
	</div>
</template>

<script>
	import {
		getMapList
	} from '@/api/farm.js'
	import VideoList from '@/view/components/video-list.vue'
	import {
		addIABigDataMap,
		getIABigDataMap,
		updateIABigDataMap
	} from '@/api/plot.js'
	import OrgTree from '@/view/components/org-tree.vue'
	export default {
		props: ['dataMapId'],
		components: {
			OrgTree,
			VideoList
		},
		data() {
			return {
				showVideo:false,
				showBelongOrg: false,
				belongOrgTitle: '',
				belongOrgInfo: '', //所属组织信息
				belongOrgName: '', //所属组织名称
				markerName: '',
				markerPosition: '',
				farmAddr: '',
				customAataList: [],
				location: '',
				keyword: '',
				center: {
					lng: 116.404,
					lat: 39.915
				},
				zoom: 15,
				showMap: false,
				orgId: this.$store.state.user.userInfo.orgId,
				showSpin: false,
				farmList: [],
				dataForm: {
					appSecret: '',
					appKey: '',
					belongOrgId: null,
					updateDataInv: 600,
					farmType: 0,
					bigDataMapName: '',
					mapId: '',
					farmPathName: '',
					centerPostion: '',
					defalutVideoId:null,
					defalutVideoName:'',
				
				},
				dataRule: {
					bigDataMapName: [{
						required: true,
						message: '数据画面名称不能为空',
						// validator: validateUserName,
						trigger: 'blur'
					}],
					mapId: [{
						required: true,
						message: '请选择关联农场',
						trigger: 'change'
					}],
					farmPathName: [{
						required: true,
						message: '请选择农场地理坐标',
						trigger: 'change'
					}],
					belongOrgId: [{
						required: true,
						type: 'number',
						message: '请选择用户所属组织',
						trigger: 'change'
					}],
					defalutVideoId: [{
						required: true,
						type: 'number',
						message: '请选择默认视频',
						trigger: 'change'
					}],

				},
				plantEnvList: [{
						id: 0,
						label: '室外'
					},
					// {
					// 	id: 1,
					// 	label: '室内'
					// }
				],
				timeList: [{
						id: 600,
						label: '10分钟'
					},
					{
						id: 900,
						label: '15分钟'
					},
					{
						id: 1200,
						label: '20分钟'
					},
					{
						id: 1500,
						label: '25分钟'
					},
					{
						id: 1800,
						label: '30分钟'
					}
				]

			}
		},
		methods: {
			handleReset(name) {
				this.$refs[name].resetFields()
				this.belongOrgName = ''
				this.dataForm.defalutVideoName = ''
			},
			getVideoInfo(row){
				// console.log(row)
				this.dataForm.defalutVideoId = row.id
				this.dataForm.defalutVideoName = row.videoName
				this.showVideo = false
			},
			showVideoList(){
				this.showVideo = true
			},
			getDataMapInfo() {
				if (this.dataMapId != '' && this.dataMapId != null) {
					this.showSpin = true
					this.getFarmList()
					getIABigDataMap(this.dataMapId).then(res => {
						const data = res.data
						this.showSpin = false
						if (data.success == 1) {
							// console.log(data)
							var iaBigDataMap = data.iaBigDataMap
							this.dataForm = {
								bigDataMapName: iaBigDataMap.bigDataMapName,
								mapId: iaBigDataMap.mapId.toString(),
								belongOrgId: iaBigDataMap.belongOrgId,
								iaVideoList: iaBigDataMap.iaVideoList,
								updateDataInv: iaBigDataMap.updateDataInv,
								farmType: iaBigDataMap.farmType,
								// defalutVideoId:iaBigDataMap.defaultVideo.id,
								// defalutVideoName:iaBigDataMap.defaultVideo.videoName,
								// 
								// appKey: iaBigDataMap.videoKey.appKey,
								// appSecret: iaBigDataMap.videoKey.appSecret,
								
							}
							if( iaBigDataMap.defaultVideo != null &&  iaBigDataMap.defaultVideo != ''){
								var defaultVideo = iaBigDataMap.defaultVideo
								this.dataForm.defalutVideoId = defaultVideo.id
								this.dataForm.defalutVideoName = defaultVideo.videoName
								// console.log(this.dataForm)
							
							}else{
								this.dataForm.defalutVideoId = iaBigDataMap.defalutVideoId
							}
							if( iaBigDataMap.openFieldFarm != null &&  iaBigDataMap.openFieldFarm != ''){
								var openFieldFarm = iaBigDataMap.openFieldFarm
								this.dataForm.farmPathName = openFieldFarm.farmAddress
								this.dataForm.centerPostion = openFieldFarm.centerPostion
								// console.log(this.dataForm)
							
							}
							// console.log(this.dataForm)
							this.belongOrgName = iaBigDataMap.orgName

						} else {
							this.$Message.error(data.errorMessage)
						}
					}).catch(error => {
						this.showSpin = false
						alert(error)
					})
				}
			},
			showBelongOrgList() { //显示所属组织列表
				this.belongOrgTitle = this.belongOrgName
				this.showBelongOrg = true

			},
			showBelongOrgInfo(data) { //显示所选所属组织信息
				this.belongOrgInfo = data
				this.belongOrgTitle = data[0].orgName
			},
			belongOrgOk() { //确定所属组织
				//const selectedNodes = this.$refs.belongOrgTree.getSelectedNodes();
				this.dataForm.belongOrgId = this.belongOrgInfo[0].id
				this.belongOrgName = this.belongOrgInfo[0].orgName
				this.showBelongOrg = false
			},
			changeFarmPath() {
				// alert(1)

				// console.log(this.markerName)
				this.dataForm.farmPathName = this.markerName
				this.dataForm.centerPostion = this.markerPosition
				this.showMap = false
			},
			markersSet(e) {
				this.markerPosition = e[0].point
				this.markerName = e[0].address + '-' + e[0].title;
			},
			getPoint(e) {
				let geocoder = new BMap.Geocoder();
				geocoder.getLocation(e.point, rs => {
					 console.log(rs)
					this.markerName = rs.address + '-' + rs.surroundingPois[0].title;
					this.markerPosition = e.point
				
				});
				// this.modalTitle =
			},
			findArea(val) {
				this.keyword = val
			},
			getFarmPath() {
				this.showMap = true
			},
			getFarmList() {
				getMapList(this.orgId).then(res => {
					const data = res.data
					if (data.success == 1) {
						this.farmList = data.mapList
					} else {
						this.$Message.error(data.errorMessage)
					}
				}).catch(error => {
					alert(error)
				})
			},
			handleRemove(index) {
				this.dataForm.iaVideoList.splice(index, 1)
			},
			handleAddDataList() {
				this.dataForm.iaVideoList.push({
					deviceName: '',
					highDefinitionUrl: '',
					fluentUrl: '',
					deviceSerial: '',
					channelNo: '',
				})
			},

			handleSubmit(name) {
				this.$refs[name].validate((valid) => {
					if (valid) {
						// console.log(this.dataForm)
						this.showSpin = true
						var iaBigDataMap = {
							bigDataMapName: this.dataForm.bigDataMapName,
							farmType: this.dataForm.farmType,
							mapId: parseInt(this.dataForm.mapId),
							belongOrgId: parseInt(this.dataForm.belongOrgId),
							updateDataInv: parseInt(this.dataForm.updateDataInv),
							defalutVideoId:parseInt(this.dataForm.defalutVideoId)


						}
						var centerPostion = {
							lng: this.dataForm.centerPostion.lng,
							lat: this.dataForm.centerPostion.lat
						}
						if (iaBigDataMap.farmType == 0) {
							iaBigDataMap.openFieldFarm = {
								centerPostion: centerPostion,
								farmAddress:this.dataForm.farmPathName
							}
						} else {
							iaBigDataMap.closeFieldFarm = {
								centerPostion: centerPostion
							}
						}
						this.showSpin = true
						console.log(iaBigDataMap)
						if(this.dataMapId != null && this.dataMapId != ''){
							iaBigDataMap.id = this.dataMapId
							updateIABigDataMap(iaBigDataMap).then(res => {
								const data = res.data
								this.showSpin = false
								if (data.success == 1) {
									this.$Message.success('编辑成功')
								} else {
									this.$Message.error(data.errorMessage)
								}
							}).catch(error => {
								this.showSpin = false
								alert(error)
							})
						}else{
							addIABigDataMap(iaBigDataMap).then(res => {
								const data = res.data
								this.showSpin = false
								if (data.success == 1) {
									this.$Message.success('添加成功')
								} else {
									this.$Message.error(data.errorMessage)
								}
							}).catch(error => {
								this.showSpin = false
								alert(error)
							})
						}
						
					}

				})
			},
			handler({
				BMap,
				map
			}) {
				// console.log(BMap, map)
				// this.center.lng = 116.404
				// this.center.lat = 39.915
				this.zoom = 15

				let _this = this; // 设置一个临时变量指向vue实例，因为在百度地图回调里使用this，指向的不是vue实例；
				var geolocation = new BMap.Geolocation();
				geolocation.getCurrentPosition(function(r) {
					_this.center = r.point // 设置center属性值
					_this.markerPosition = r.point

					console.log('center:', _this.center) // 如果这里直接使用this是不行的
				}, {
					enableHighAccuracy: true
				})
			}



		},
		mounted() {},
		created() {
			// this.getRtuList()
			this.getDataMapInfo()
		}
	}
</script>

<style>
	.bm-map {
		width: 100%;
		height: 100%;
	}
</style>
