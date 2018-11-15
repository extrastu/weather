// pages/searchRes/searchRes.js
const app = getApp()
const { $Toast } = require('../../dist/base/index');
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		nvabarData: {
			showCapsule: 1, //是否显示左上角图标
			title: '', //导航栏 中间的标题
			isBackShow: "false",
			bgColor: ""
		},
		// 此页面 页面内容距最顶部的距离
		height: app.globalData.height * 2 + 20,
		dh: app.globalData.dh,
		key:"",
		photoArr:[],
		isComplie:false,
		spinShow:true
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		let key = options.key
		this.setData({
			key: key
		})
		this.search(key)
	},

	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady: function () {

	},

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: function () {
		wx.vibrateShort()
	},

	/**
	 * 生命周期函数--监听页面隐藏
	 */
	onHide: function () {

	},

	/**
	 * 生命周期函数--监听页面卸载
	 */
	onUnload: function () {

	},

	/**
	 * 页面相关事件处理函数--监听用户下拉动作
	 */
	onPullDownRefresh: function () {

	},

	/**
	 * 页面上拉触底事件的处理函数
	 */
	onReachBottom: function () {

	},

	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage: function () {

	},
	search: function (key) {
		let that = this
		let val = key
		let dataObj = JSON.stringify({
			key: val
		})
		
		that.setData({
			spinShow: true
		})
		wx.request({
			url: 'https://www.extrastu.xin/search',
			method: "POST",
			data: dataObj,
			header: {
				'content-type': 'application/json' // 默认值
			},
			success(res) {
				wx.vibrateShort()
				if (res.data.length == 0) {
					$Toast({
						content: '什么也没有找到,2s后返回搜索~'
					})
					setTimeout(()=>{
						that._navback();
					},2000)
				} else {
					that.setData({
						photoArr: res.data,
						spinShow: false,
						isComplie:true
					})
					that.queryTags(key)
				}
				
			}
		})
	},
	// 进入详情页
	infoPage: function (e) {
		let id = e.target.dataset.id
		wx.navigateTo({
			url: '../infoPage/infoPage?id=' + id
		})
	},
	_navback() {
		wx.navigateBack()
	},
	// 添加一条数据
	addTags: function (tag, time) {
		let that = this
		const db = wx.cloud.database()
		db.collection('tags').add({
			data: {
				tag: tag,
				createdAt: time,
			},
			success: res => {
				console.log('[数据库] [新增tags记录] 成功，记录 _id: ', res._id)
			},
			fail: err => {
				console.error('[数据库] [新增tags记录] 失败：', err)
			}
		})
	},
	// 查询tags
	queryTags: function (key) {
		let that = this
		const db = wx.cloud.database()
		db.collection('tags').where({tag:key}).limit(100).get({
			success: res => {
				// console.log('[数据库] [查询tags记录] 成功: ', res)
				if(res.data.length>0){
					console.log('该tag:'+key+'已存在')
				}else{
					that.addTags(key,new Date())
				}
			},
			fail: err => {
				wx.showToast({
					icon: 'none',
					title: '查询tags记录失败'
				})
				console.error('[数据库] [查询tags记录] 失败：', err)
			}
		})
	}
})