<template>
	<div ref="maps" style="height: 100%;overflow: auto;background: #f8f8f9">

		<div ref="map" style="width:80%;float: left;overflow:hidden;background: #808695;height:100%;display: flex;justify-content:center;position: relative;">
			<div v-show="showMap" id="mapBgDiv" ref="mapBgDiv" style="position: absolute;height: 100%;overflow:hidden;background: #00BFFF;width: 100%;">
				<img id="mapBgImg" ref="mapBgImg" :src="mapBgImgUrl" style="z-index: 1;height: 100%;width: 100%;" draggable="false" :class="{ widthActive:value }" />
				<div v-for="item in rtuImgList" :key="item.rtuNumber" v-drag class="drag" :style="{top:item.heightScale+'%',left:item.widthScale+'%'}">
					<Poptip transfer :title="item.rtuNumber">
						<div slot="content">
							<div v-show="!item.workingRtuVideo">
								未加入视频轮播
								<Button size="small" type="primary" @click="addShufflingRtu(item)">加入</Button>
							</div>
							<div v-show="item.workingRtuVideo">
								已加入视频轮播
								<Button size="small" type="error" @click="delShufflingRtu(item)">退出</Button>
							</div>
						</div>
						<div class="rtuImgStyle">
							<img :src="item.rtuTypeImgUrl" class="rtu" :alt="item.rtuNumber" :draggable="false" />
						</div>
					</Poptip>
				</div>
				<div v-for="item in rtuVideoList" :key="item.id" :id="item.id" v-drag class="dragVideo" :style="{top:item.heightScale+'%',left:item.widthScale+'%'}"
				 :title="item.videoName">
					<Poptip :title="item.videoName">
						<div class="rtuImgStyle">
							<Icon size="25" class="rtu" :type="' iconfont '+item.typeIcon" />
						</div>
					</Poptip>
				</div>
			</div>

		</div>
		<div style="width:20%;float: right;background:#dcdee2;height: 100%;position:relative;">
			<!-- <div style="position: absolute;height: 100%;"> -->
			<div style="padding: 5px;text-align: center;">
				<!-- <Button style="margin: 5px 0;" type="success" @click="belongOrgOk">上传地图</Button> -->
				<Upload :show-upload-list="false" :on-success="handleSuccess" :format="['jpg','jpeg','png']" :max-size="500"
				 :on-format-error="handleFormatError" :on-exceeded-size="handleMaxSize" :action="uploadAction" :headers="uploadHeaders"
				 :on-error="handleError">
					<Button type="success">上传地图</Button>
				</Upload>

			</div>
			<div style="position: absolute;top:3.125rem;bottom:9rem;background: #c5c8ce;;padding: 5px;overflow: auto;text-align: left;width: 100%;">

				<Tabs type="card">
					<TabPane label="设备">
						<Input search enter-button placeholder="请输入名称关键字..." size="small" />
						<Tree @on-check-change="checkRtu" :data="rtuListData" show-checkbox multiple></Tree>
						<div v-show="showAddRtu" style="text-align: center;">
							<a @click="getRtuList(rtuImgList)">加载更多...</a>
						</div>
					</TabPane>
					<TabPane label="视频">
						<Tree @on-check-change="checkVideo" :data="videoListData" show-checkbox multiple></Tree>
					</TabPane>
					<TabPane label="轮播设备">
						<div v-for="(item,index) in shufflingRtuList" :key="index">
							{{item.title}}
							<Icon style="margin-left: 0.625rem;cursor:pointer" size="20" type="md-close" @click="delShufflingRtu(item)" />
						</div>
					</TabPane>
				</Tabs>

				<!-- <Tree @on-check-change="checkRtu" :data="rtuListData" show-checkbox multiple></Tree>
				<div v-show="showAddRtu" style="text-align: center;" >
					<a @click="getRtuList">加载更多...</a>
				</div> -->
			</div>

			<div style="position:absolute;bottom: 0;text-align: center;">
				<div>
					刷新周期:
					<Select v-model="refreshDataInv" size="small" style="width: 70%;">
						<Option v-for="item in refreshDataList" :value="item.value" :key="item.value">{{ item.label }}</Option>
					</Select>
				</div>
				<div style="margin: 0.625rem 0;">
					地图名称:<Input v-model="mapName" placeholder="请输入地图名称" style="width: 70%;" size="small" />
				</div>
				<Input size="small" readonly v-model="belongOrgName" search enter-button="选择" placeholder="请选择所属组织" @on-search="showBelongOrgList"></Input>

				<Button style="margin: 0.625rem 0;" type="primary" @click="saveMap">保存</Button>
			</div>
			<div v-show="mapId != null" style="position: absolute;bottom: 0;right: 0;"><a @click="goBack">返回</a></div>

		</div>
		<!-- </div> -->
		<div style="position: absolute;right:30px;">
			<Tooltip :content="value ? '退出全屏' : '全屏'" placement="bottom">
				<Icon @click.native="handleFullscreen" :type="value ? 'md-contract' : 'md-expand'" :size="23"></Icon>
			</Tooltip>
		</div>
		
		<Modal :title="'当前选择:'+ belongOrgTitle" v-model="showBelongOrg">
			<Icon slot="close" type="md-close"  size="30"/>
			<div class="tree-style">
				<org-tree v-if="showBelongOrg" @getBelongOrgInfo="showBelongOrgInfo" :orgTypeId="null"></org-tree>
			</div>
			<div slot="footer">
				<Button type="primary" size="large" @click="belongOrgOk">确定</Button>
			</div>
		</Modal>

	</div>
</template>

<script>
	import OrgTree from '@/view/components/org-tree.vue'
	import rainfallDetector from '@/assets/images/rainfallDetector.png'
	import bg from '@/assets/images/map.jpg'
	import {
		addMap,
		getMap,
		updateMap
	} from '@/api/farm.js'
	import {
		getRtuList,
	} from '@/api/rtu'
	import {
		getAllVideoList,
	} from '@/api/video.js'
	export default {
		components:{
			OrgTree
		},
		props: {
			mapId: {
				type: Number,
				default: null
			}
		},
		data() {
			return {
				belongOrgId:null,
				showBelongOrg: false,
				belongOrgTitle: '',
				belongOrgInfo: '', //所属组织信息
				belongOrgName: '', //所属组织名称
				// belongOrgId:this.$store.state.user.userInfo.belongOrgId,
				showMap: false,
				value: false,
				rtuImgList: [],
				rtuListData: [],
				uploadAction: this.$config.baseUrl.dev + '/v1/uploadFiles',
				uploadHeaders: {
					From: this.$store.state.app.iotInterFace,
					Token: this.$store.state.user.token,
					Dir: '/uploadFile/maps/'
				},
				checkRtuData: [],
				mapBgImgUrl: '',
				videoListData: [],
				refreshDataInv: null,
				searchKey: '',
				maxId: 0,
				pageSize: 50,
				keyField: 0,
				showAddRtu: true,
				mapName: null,
				rtuVideoList: [],
				shufflingRtuList: [],
				refreshDataList: []

			}
		},

		directives: {
			drag(el, bindings) {
				// console.log(el)
				el.onmousedown = function(e) {

					let mapHeight = document.getElementById('mapBgDiv').offsetHeight;
					let mapWidth = document.getElementById('mapBgDiv').offsetWidth;
					let disx = e.clientX - el.offsetLeft;
					let disy = e.clientY - el.offsetTop;
					// console.log('disx:'+disx)
					document.onmousemove = function(e) {
						el.style.left = (e.clientX - disx) / mapWidth * 100 + '%';
						el.style.top = (e.clientY - disy) / mapHeight * 100 + '%';
					}
					document.onmouseup = function() {
						document.onmousemove = document.onmouseup = null;
					}
				}
			},

		},
		methods: {
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
				this.belongOrgId = this.belongOrgInfo[0].id
				this.belongOrgName = this.belongOrgInfo[0].orgName
				this.showBelongOrg = false
			},
			delShufflingRtu(item) {
				var list = this.shufflingRtuList
				for (var i = 0; i < list.length; i++) {
					if (item.rtuNumber == list[i].rtuNumber) {
						this.shufflingRtuList.splice(i, 1);
						item.workingRtuVideo = false
					}
				}
			},
			addShufflingRtu(item) {
				this.shufflingRtuList.push(item)
				item.workingRtuVideo = true
			},
			saveMap() {
				// console.log(this.rtuImgList)
				if(this.belongOrgId == null || this.belongOrgId == ''){
					alert('请先选择地图所属组织再进行保存')
					return
				}
				let rtusPostionJson = []
				let videoPostionIson = []
				let workingRtuVideoList = []
				let maps = document.getElementsByClassName('drag');
				let mapsVideo = document.getElementsByClassName('dragVideo');
				let list = this.shufflingRtuList
				for (var i = 0; i < list.length; i++) {
					workingRtuVideoList.push(list[i].rtuNumber)
				}
				for (var i = 0; i < maps.length; i++) {
					rtusPostionJson.push({
						'rtuNumber': parseInt(maps[i].getElementsByTagName("img")[0].alt),
						'x': parseFloat(maps[i].style.left),
						'y': parseFloat(maps[i].style.top)
					})

				}
				// console.log(mapsVideo)
				for (var i = 0; i < mapsVideo.length; i++) {
					// console.log(mapsVideo)
					videoPostionIson.push({
						'videoId': parseInt(mapsVideo[i].id),
						// 'videoType': parseInt(mapsVideo[i].title),
						'x': parseFloat(mapsVideo[i].style.left),
						'y': parseFloat(mapsVideo[i].style.top)
					})
				}
				// console.log(videoPostionIson)
				// console.log(rtusPostionJson)
				let imgWidth = document.getElementById("mapBgImg").offsetWidth
				let imgHeight = document.getElementById("mapBgImg").offsetHeight
				let map = {
					"mapName": this.mapName,
					"bgImgUrl": this.mapBgImgUrl,
					"rtuPostionList": rtusPostionJson,
					"belongOrgId": this.belongOrgId,
					"imgWidth": imgWidth,
					"imgHeight": imgHeight,
					"videoPostionList": videoPostionIson,
					"refreshDataInv": this.refreshDataInv,
					"workingRtuVideoList": workingRtuVideoList
				}
				if (this.mapId != null && this.mapId != '') {
					map.id = this.mapId
					// console.log(map)
					updateMap(map).then(res => {
						const data = res.data
						if (data.success == 1) {
							this.$Message.success('更改成功')
						} else {
							this.$Message.error(data.errorMessage)
						}
					}).catch(error => {
						alert(error)
					})
				} else {
					addMap(map).then(res => {
						const data = res.data
						if (data.success == 1) {
							this.$Message.success('保存成功')
						} else {
							this.$Message.error(data.errorMessage)
						}
					}).catch(error => {
						alert(error)
					})
				}



			},
			goBack() {
				this.$emit('go-back', '')
			},
			belong() {
				this.mapBgImgUrl = bg
			},
			checkRtu(list, item) {
				if (this.mapBgImgUrl == null || this.mapBgImgUrl == '') {
					this.$Message.warning('请先选择地图再选择设备')
					item.checked = false
					return
				}
				this.rtuImgList = list
				// console.log(this.rtuListData)
			},
			checkVideo(list, item) {
				// if (this.mapBgImgUrl == null || this.mapBgImgUrl == '') {
				// 	this.$Message.warning('请先选择地图再选择设备')
				// 	item.checked = false
				// 	return
				// }
				this.rtuVideoList = list
				// console.log(this.rtuVideoList)
			},
			getVideoList(list) {
				getAllVideoList().then(res => {
					const data = res.data
					if (data.success == 1) {
						// console.log(data)
						this.videoListData = data.videoList.map(item => {
							item.checked = false
							item.title = item.videoName + '(' + item.brandTag + '|' + item.deviceSerial + ')'
							if (item.videoType == 1) {
								item.typeIcon = 'icon-qj1'
							} else {
								item.typeIcon = 'icon-qj0'
							}
							item.heightScale = 0
							item.widthScale = 0
							if (list) {
								for (var i = 0; i < list.length; i++) {
									if (list[i].videoId == item.id) {
										item.checked = true
										item.heightScale = list[i].y
										item.widthScale = list[i].x
										this.rtuVideoList.push(item)
									}
								}
							}

							return item
						})
						// console.log(this.videoListData)

					} else {
						this.$Message.error(data.errorMessage)
					}
				}).catch(error => {
					alert(error)
				})
			},
			getRtuList(list, rvList) {
				// console.log(list)
				var orgId = this.$store.state.user.userInfo.orgId
				getRtuList(this.keyField, this.searchKey,orgId, this.maxId, this.pageSize).then(res => {
					const data = res.data
					if (data.success == 1) {
						data.iaRtuList.map(item => {
							// item.imgSrc = rainfallDetector
							if (this.maxId < item.id) {
								this.maxId = item.id
							}
							item.title = item.rtuNumber + '(' + item.rtuName + '|' + item.rtuTypeName + ')'
							item.workingRtuVideo = false
							item.checked = false
							if (rvList) {
								for (var j = 0; j < rvList.length; j++) {
									if (rvList[j] == item.rtuNumber) {
										// list[i].workingRtuVideo = true
										item.workingRtuVideo = true
										this.shufflingRtuList.push(item)
									}
								}
							}
							for (var i = 0; i < list.length; i++) {
								if (item.id == list[i].id) {
									item.checked = true
									item.heightScale = list[i].heightScale
									item.widthScale = list[i].widthScale
								}

							}
							this.rtuListData.push(item)
							if (data.iaRtuList.length == this.pageSize) {
								this.showAddRtu = true
							} else {
								this.showAddRtu = false
							}
						})
						// this.rtuImgList = list
						// console.log(rvList)

					} else {
						this.$Message.error(data.errorMessage)
					}
				}).catch(error => {
					alert(error)
				})
			},
			handleSuccess(response, file) {

				if (response.success == 1) {
					// console.log(response.sizeList)
					this.showMap = true
					this.mapBgImgUrl = response.srcList.toString()
				} else {
					this.$Message.error(response.errorMessage);
				}
			},
			handleError(error) {
				this.$Message.error(error);
			},
			handleFormatError(file) {
				this.$Message.warning('上传格式错误，请选择jpg/jpeg/png图片');
			},
			handleMaxSize(file) {
				this.$Message.warning('上传图片过大，请选择少于50kb的图片上传');
			},
			handleFullscreen() {
				// let main = main.body
				let main = this.$refs.maps
				if (this.value) {
					this.value = false
					if (document.exitFullscreen) {
						document.exitFullscreen()
					} else if (document.mozCancelFullScreen) {
						document.mozCancelFullScreen()
					} else if (document.webkitCancelFullScreen) {
						document.webkitCancelFullScreen()
					} else if (document.msExitFullscreen) {
						document.msExitFullscreen()
					}

				} else {
					this.value = true
					if (main.requestFullscreen) {
						main.requestFullscreen()
					} else if (main.mozRequestFullScreen) {
						main.mozRequestFullScreen()
					} else if (main.webkitRequestFullScreen) {
						main.webkitRequestFullScreen()
					} else if (main.msRequestFullscreen) {
						main.msRequestFullscreen()
					}
				}
				// console.log(main)
				//this.launchFullScreen(main)

			},
			getMapInfo() {
				// alert(1)
				if (this.mapId != null && this.mapId != '') {
					getMap(this.mapId).then(res => {
						const data = res.data
						if (data.success == 1) {
							this.showMap = true
							const map = data.map
							const iaRtuList = data.iaRtuList
							this.mapBgImgUrl = map.bgImgUrl
							// this.rtuImgList = iaRtuList
							this.mapName = map.mapName
							this.refreshDataInv = map.refreshDataInv
							this.belongOrgId = map.belongOrgId
							this.belongOrgName = map.orgName
							// this.checkRtuData = iaRtuList
							// console.log(this.rtuImgList)
							for(var i= 0;i<iaRtuList.length;i++){
								iaRtuList[i].checked = true
								this.rtuImgList.push(iaRtuList[i])
							}
							this.getRtuList(iaRtuList, map.workingRtuVideoList)
							this.getVideoList(map.videoPostionList)


						} else {
							this.$Message.error(data.errorMessage)
						}
					}).catch(error => {
						alert(error)
					})
				} else {
					this.getRtuList([])
					this.getVideoList([])
				}
			}
		},

		mounted() {
			// this.getRtuList()

		},
		created() {
			// this.$route.meta.keepAlive = true
			this.getMapInfo()
			this.refreshDataList = [{
					value: 5,
					label: '5秒',
				},
				{
					value: 10,
					label: '10秒',
				},
				{
					value: 30,
					label: '30秒',
				},
				{
					value: 60,
					label: '1分钟',
				},
				{
					value: 180,
					label: '3分钟',
				},
				{
					value: 300,
					label: '5分钟',
				},
				{
					value: 600,
					label: '10分钟',
				},
				{
					value: 1200,
					label: '20分钟',
				},
				{
					value: 1800,
					label: '30分钟',
				},
			]
		},

	}
</script>

<style>
	.widthActive {
		max-width: 100%;
	}

	.rtu {
		max-width: 100%;
		max-height: 100%;
		z-index: 2;
	}

	.rtuImgStyle {
		width: 1.875rem;
		height: 1.875rem;
		border-radius: 50%;
		background: #00BFFF;
		line-height: 1.875rem;
		background: rgba(255, 0, 0, 0.5);
		overflow: hidden;
		box-shadow: 0 0 5px #000;
		border-radius: 50%;
		color: #fff;
		text-align: center;
		display: flex;
		justify-content: center;
		align-items: center
	}

	.drag {
		/* width: 100px; */
		/* display: inline-block; */
		position: absolute;
		height: 1.875rem;
		width: 1.875rem;
		/* width: 2%; */
		/* height: 4%; */
		/* background: #DB7093; */
		/* overflow: hidden; */
		/* z-index: 1; */

	}

	.dragVideo {

		position: absolute;
		height: 1.875rem;
		width: 1.875rem;

	}
</style>
