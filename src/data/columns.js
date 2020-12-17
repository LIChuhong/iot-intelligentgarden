//组织列表
export const orgListColumns = [{ //组织列表
		title: 'ID',
		key: 'id',
		align: 'center',
		// width: 100
	},
	{
		title: '组织名称',
		key: 'orgName',
		align: 'center',
		// minWidth: 100

	},
	{
		title: '组织Logo',
		slot: 'orgLogo',
		align: 'center',
		//width:'100'
		// minWidth: 100
	},
	{
		title: '类型',
		key: 'orgTypeName',
		align: 'center',
		//minWidth: 100

	},
	{
		title: '操作',
		slot: 'action',
		align: 'center',
		// width: 200

	},
]

export const rtuListColumns = [{ //设备列表
		title: 'ID',
		key: 'id',
		align: 'center',
		width: 100

	},
	{
		title: '设备图',
		slot: 'rtuTypeImgUrl',
		align: 'center',
		//width: '100'
		width: 100

	},
	{
		title: '编号(名称)/序列号',
		slot: 'nameAndserialNum',
		align: 'center',
		width: 250


	},
	{
		title: '类型',
		key: 'rtuTypeName',
		align: 'center',
		width: 150

	},
	{
		title: '所属组织',
		key: 'orgName',
		align: 'center',
		//width: 150

	},
	{
		title: '操作',
		slot: 'action',
		align: 'center',
		width: 320


	}
]

export const rtuListColumns1 = [ //手机端设备列表
	{
		title: '设备图',
		slot: 'rtuTypeImgUrl',
		align: 'center',
		//width: '100'
		// width: 100

	},
	{
		title: '编号(名称)',
		slot: 'nameAndserialNum',
		align: 'center',
		// width: 250


	},

	{
		title: '状态',
		slot: 'rtuState',
		align: 'center',
		//width: 150

	},
	{
		title: '操作',
		slot: 'action',
		align: 'center',
		// width: 320


	}
]

export const userListColumns = [{ //用户列表
		title: 'ID',
		key: 'id',
		align: 'center',
		width: 100
	},
	{
		title: '用户名',
		key: 'userName',
		align: 'center',
		//width: 100

	},

	{
		title: '用户头像',
		slot: 'userHeadImgUrl',
		align: 'center',
		width: 100
	},

	{
		title: '真实姓名',
		key: 'realName',
		align: 'center',
		// width: 100
	},

	{
		title: '级别',
		key: 'userRolesName',
		align: 'center',
		//width: 150
	},
	{
		title: '联系电话',
		key: 'telephone',
		align: 'center',
		//width: 150
	},
	{
		title: '创建时间',
		key: 'createTime',
		align: 'center',
		width: 160

	},
	{
		title: '操作',
		slot: 'action',
		align: 'center',
		width: 250

	},
]

export const userListColumns1 = [{ //用户列表
		title: 'ID',
		key: 'id',
		align: 'center',
		// width: 100
	},
	{
		title: '用户名',
		key: 'userName',
		align: 'center',
		//width: 100

	},


	{
		title: '真实姓名',
		key: 'realName',
		align: 'center',
		// width: 100
	},

	{
		title: '级别',
		key: 'userRolesName',
		align: 'center',
		//width: 150
	},
	{
		title: '联系电话',
		key: 'telephone',
		align: 'center',
		//width: 150
	},

	{
		title: '操作',
		slot: 'action',
		align: 'center',
		// width: 250

	},
]

export const mapListColumns = [{ //农场列表
		title: 'ID',
		key: 'id',
		align: 'center',
		width: 70
	},
	{
		title: '地图名称',
		key: 'mapName',
		align: 'center',
		width: 100
	},
	{
		title: '操作',
		slot: 'action',
		align: 'center',
		// width: 250

	},
]

export const strategyColumns = [{ //策略列表
		title: 'ID',
		key: 'id',
		align: 'center',
		width: 70
	},
	{
		title: '策略名称',
		key: 'strategyName',
		align: 'center',
		// width: 100
	},
	{
		title: '所属组织',
		key: 'orgName',
		align: 'center',
		// width: 100
	},
	{
		title: '创建人',
		key: 'userName',
		align: 'center',
		 // width: 100
	},
	{
		title: '操作',
		slot: 'action',
		align: 'center',
		// width: 250

	},
]


export const bindingLinkColumns = [{ //绑定联动列表
		title: 'ID',
		key: 'id',
		align: 'center',
		width: 70
	},
	{
		title: '联动名称',
		key: 'linkageName',
		align: 'center',
	},
	{
		title: '联动设备',
		key: 'linkageRtuNumber',
		align: 'center',
		// width: 100
	},
	
	{
		title: '操作',
		slot: 'action',
		align: 'center',
		// width: 250

	},
]

export const linkRtuColumns = [{ //联动设备列表
		title: 'ID',
		key: 'id',
		align: 'center',
		width: 70
	},
	{
		title: '设备编号',
		key: 'rtuNumber',
		align: 'center',
	},
	{
		title: '设备名称',
		key: 'rtuName',
		align: 'center',
		// width: 100
	},
	
	{
		title: '操作',
		slot: 'action',
		align: 'center',
		// width: 250

	},
]

export const linkColumns = [{ //联动列表
		title: 'ID',
		key: 'id',
		align: 'center',
		width: 70
	},
	{
		title: '联动名称',
		key: 'linkageName',
		align: 'center',
	},
	{
		title: '联动类型',
		slot: 'linkageType',
		align: 'center',
		// width: 100
	},
	{
		title: '联动设备编号',
		key: 'linkageRtuNumber',
		align: 'center',
		// width: 100
	},
	{
		title: '联动设备类型',
		key: 'rtuTypeName',
		align: 'center',
		// width: 100
	},
	{
		title: '联动参数',
		key: 'parameterName',
		align: 'center',
		// width: 100
	},
	{
		title: '操作',
		slot: 'action',
		align: 'center',
		// width: 250

	},
]


export const timingColumns = [
	{ //定时列表
		title: 'ID',
		key: 'id',
		align: 'center',
		width: 70
	},
	{
		title: '定时名称',
		key: 'timerName',
		align: 'center',
	},
	{
		title: '类型/周期',
		tooltip:true,
		slot: 'timerType',
		align: 'center',
		// width: 100,
		

	},
	{
		title: '测试策略',
		key: 'switchsStrategyName',
		align: 'center',
		// width: 250
	},
	{
		title: '执行时间',
		key: 'startTimer',
		align: 'center',
		width: 100
	},
	{
		title: '所属组织',
		key: 'orgName',
		align: 'center',
		// width: 100
	},

	{
		title: '创建用户',
		key: 'userName',
		align: 'center',
		// width: 100
	},
	{
		title: '操作',
		slot: 'action',
		align: 'center',
		 width: 250

	},
]

export const warnListColumns = [{ //告警列表
		title: 'ID',
		key: 'id',
		align: 'center',
		width: 70
	},
	{
		title: '告警名称',
		key: 'warnName',
		align: 'center',
	},
	{
		title: '告警上限',
		key: 'warnMaxValue',
		align: 'center',
		// width: 100
	},
	{
		title: '告警下限',
		key: 'warnMinValue',
		align: 'center',
		// width: 100
	},
	{
		title: '操作',
		slot: 'action',
		align: 'center',
		// width: 250


	},
]

export const warnRtuColumns = [{ //告警设备列表
		title: 'ID',
		key: 'id',
		align: 'center',
		width: 70
	},
	{
		title: '设备编号',
		key: 'rtuNumber',
		align: 'center',
	},
	{
		title: '设备名称',
		key: 'rtuName',
		align: 'center',
		// width: 100
	},

	{
		title: '操作',
		slot: 'action',
		align: 'center',
		// width: 250

	},
]

export const wRDetailsColumns = [{ //告警设备列表
		title: 'ID',
		key: 'parameterId',
		align: 'center',
		width: 70
	},
	{
		title: '参数名称',
		key: 'parameterName',
		align: 'center',
	},
	{
		title: '告警名称',
		key: 'warnName',
		align: 'center',
		// width: 100
	},
	{
		title: '上限',
		key: 'warnMaxValue',
		align: 'center',
		// width: 100
	},
	{
		title: '下限',
		key: 'warnMinValue',
		align: 'center',
		// width: 100
	},

	{
		title: '操作',
		slot: 'action',
		align: 'center',
		// width: 250
		width: 70

	},
]

export const plotColumns = [{ //地块列表
		title: 'ID',
		key: 'id',
		align: 'center',
		width: 70
	},
	{
		title: '地块名称',
		key: 'massifName',
		align: 'center',
	},
	{
		title: '作物名称',
		key: 'cropName',
		align: 'center',
		// width: 100
	},
	{
		title: '作物图片',
		slot: 'cropImgUrl',
		align: 'center',
		// width: 100
	},
	// {
	// 	title: '下限',
	// 	key: 'warnMinValue',
	// 	align: 'center',
	// 	// width: 100
	// },
	// 
	{
		title: '操作',
		slot: 'action',
		align: 'center',
		// width: 250
		// width: 70

	},
]

export const dataMapColumns = [{ //数据画面列表
		title: 'ID',
		key: 'id',
		align: 'center',
		width: 70
	},
	{
		title: '数据画面名称',
		key: 'bigDataMapName',
		align: 'center',
	},
	{
		title: '农场画面名称',
		key: 'mapName',
		align: 'center',
		// width: 100
	},
	{
		title: '定时刷新时间',
		key: 'updateDataInv',
		align: 'center',
		// width: 100
	},
	{
		title: '所属组织',
		key: 'orgName',
		align: 'center',
		// width: 100
	},
	// 
	{
		title: '操作',
		slot: 'action',
		align: 'center',
		// width: 250
		// width: 70

	},
]

export const brandColumns = [{ //品牌列表
		title: 'ID',
		key: 'id',
		align: 'center',
		width: 70
	},
	{
		title: '品牌名称',
		key: 'brandName',
		align: 'center',
	},
	{
		title: '品牌标识',
		key: 'brandTag',
		align: 'center',
		// width: 100
	},
	{
		title: '所属组织',
		key: 'orgName',
		align: 'center',
		// width: 100
	},

	{
		title: '操作',
		slot: 'action',
		align: 'center',
		// width: 250
		// width: 70

	},
]

export const videoColumns = [{ //视频列表
		title: 'ID',
		key: 'id',
		align: 'center',
		width: 70
	},
	{
		title: '视频名称',
		key: 'videoName',
		align: 'center',
	},
	{
		title: '设备序列号',
		key: 'deviceSerial',
		align: 'center',
		// width: 100
	},
	{
		title: '品牌',
		key: 'brandName',
		align: 'center',
		// width: 100
	},
	{
		title: '所属组织',
		key: 'orgName',
		align: 'center',
		// width: 100
	},

	{
		title: '操作',
		slot: 'action',
		align: 'center',
		// width: 250
		// width: 70

	},
]

export const video1Columns = [{ //视频列表
		title: 'ID',
		key: 'id',
		align: 'center',
		width: 70
	},
	{
		title: '视频名称',
		key: 'videoName',
		align: 'center',
	},
	{
		title: '设备序列号',
		key: 'deviceSerial',
		align: 'center',
		// width: 100
	},
	{
		title: '品牌',
		key: 'brandName',
		align: 'center',
		// width: 100
	},
	
	{
		title: '操作',
		slot: 'action',
		align: 'center',
		// width: 250
		// width: 70

	},
]

//浇水记录
export const waterRecordColumns =[
	{ 
			title: '时间',
			key: 'time',
			align: 'center',
			width: 70
		},
		{
			title: '操作模式',
			slot: 'operationType',
			align: 'center',
		},
		{
			title: '执行时长',
			key: 'exeTime',
			align: 'center',
			// width: 100
		},
		{
			title: '操作用户',
			key: 'userName',
			align: 'center',
			// width: 100
		},
	
]

//应用列表
export const appColumns =[
	{ 
			title: 'ID',
			key: 'id',
			align: 'center',
			width: 70
		},
		{
			title: '应用名称',
			key: 'appName',
			align: 'center',
		},
		{
			title: '创建时间',
			key: 'createTime',
			align: 'center',
			// width: 100
		},
		{
			title: '更新时间',
			key: 'updateTime',
			align: 'center',
			// width: 100
		},
		
		{
			title: '所属用户',
			key: 'userName',
			align: 'center',
			// width: 100
		},
		{
			title: '组织',
			key: 'orgName',
			align: 'center',
			// width: 100
		},
		{
			title: '操作',
			slot: 'action',
			align: 'center',
		
		},
	
]
