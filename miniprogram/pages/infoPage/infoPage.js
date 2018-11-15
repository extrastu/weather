// pages/infoPage/infoPage.js
const app = getApp()
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
		imgObj:{}
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		console.log(options.id)
		let id = options.id
		this.getPhoto(id)
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
	getPhoto:function(ids){
		let that =this
		let dataObj = JSON.stringify({
			id: ids
		})
		wx.request({
			url: 'https://www.extrastu.xin/getPhoto',
			method: "POST",
			data: dataObj,
			header: {
				'content-type': 'application/json' // 默认值
			},
			success(res) {
				console.log(res)
				that.setData({
					imgObj:res.data,
					nvabarData: {
						title: res.data.description,
						showCapsule: 1,
						isBackShow: "false"
					}
				})
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
	}
})
