// pages/search/search.js
const app = getApp()
const { $Toast } = require('../../dist/base/index');
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		nvabarData: {
			showCapsule: 1, //是否显示左上角图标
			title: '搜索', //导航栏 中间的标题
			isBackShow: "false",
			bgColor: "pink"
		},
		// 此页面 页面内容距最顶部的距离
		height: app.globalData.height * 2 + 20,
		dh: app.globalData.dh,
		value1:"",
		photoArr:[],
		tags:[],
		spinShow:false,
		isNone:false,
		current: 'tab1',
		current_scroll: 'tab1'
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		this.queryTags()
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
	search:function(e){
		let that = this
		let val = e.detail.detail.value
		let dataObj =JSON.stringify({
			key:val
		})
		if (val == '') {
			$Toast({
				content: '什么也没有输入'
			})
			return false;
		}
		that.setData({
			spinShow:true
		})
		wx.request({
			url: 'https://www.extrastu.xin/search',
			method:"POST",
			data: dataObj,
			header: {
				'content-type': 'application/json' // 默认值
			},
			success(res) {
				console.log(res)
				if (res.data.length==0){
					$Toast({
						content: '什么也没有找到'
					})
					that.setData({
						spinShow: false
					})
				}else{
					that.setData({
						value1: val,
						photoArr: res.data,
						spinShow: false
					})
				}
				if(val!=''){
					that.addTags(val, new Date())
				}
			}
		})
	},
	//点击预览图片
	checkImg: function (e) {
		wx.vibrateShort()
		var imgArr = []
		console.log(e.currentTarget.dataset.src)
		imgArr.push(e.currentTarget.dataset.src)
		wx.previewImage({
			current: e.currentTarget.dataset.src, //当前图片地址
			urls: imgArr, //所有要预览的图片的地址集合 数组形式
			success: function (res) { },
			fail: function (res) { },
			complete: function (res) { }
		})
	},
	
	queryTags: function () {
		let that = this
		const db = wx.cloud.database()
		db.collection('tags').where({  }).limit(10).get({
			success: res => {
				console.log('[数据库] [查询tags记录] 成功: ', res)
				that.setData({
					tags:res.data
				})
			},
			fail: err => {
				wx.showToast({
					icon: 'none',
					title: '查询tags记录失败'
				})
				console.error('[数据库] [查询tags记录] 失败：', err)
			}
		})
	},
	// 进入详情页
	infoPage:function(e){
		let id = e.target.dataset.id
		wx.navigateTo({
			url: '../infoPage/infoPage?id=' + id
		})
	},
	intoRes:function(e){
		console.log(e)
		let key = e.detail.detail.value
		if(key==''){
			$Toast({
				content: '什么也没有输入'
			})
			return false;
		}else{
			wx.navigateTo({
				url: '../searchRes/searchRes?key=' + key
			})
		}
	},
	handleChange({ detail }) {
		this.setData({
			current: detail.key
		});
	},

	handleChangeScroll({ detail }) {
		this.setData({
			current_scroll: detail.key
		});
	}
})