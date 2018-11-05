// pages/sm/sm.js
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
			bgColor: "#2b85e4"
		},
		// 此页面 页面内容距最顶部的距离
		height: app.globalData.height * 2 + 20,
		dh: app.globalData.dh,
		imgPath:"点击上方按钮开始上传"
	},

    /**
     * 生命周期函数--监听页面加载
     */
	onLoad: function (options) {

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
	selectImg: function(){
		let that = this
		let result= ""
		wx.chooseImage({
			success: ret => {
				var filePath = ret.tempFilePaths[0];
				wx.uploadFile({
					url: 'http://www.extrastu.xin/sm',
					filePath: filePath,
					name: 'smfile',
					success: res => {
						console.log('上传成功：', JSON.parse(res.data) );
						result = JSON.parse(res.data)
						console.log(result.data)
						that.setData({
							imgPath: result.data.url
						})
						wx.setClipboardData({
							data: result.data.url,
							success(res) {
								wx.getClipboardData({
									success(res) {
										console.log(res.data) // data
									}
								})
							}
						})
						$Toast({
							content: '你好,上传完毕,点击下方按钮复制链接',
							type: 'sucess'
						});
					}
				});
			}
		})
	},
	doCopy:function(e){
		let imgPath = e.currentTarget.dataset.link
		if (imgPath =='点击上方按钮开始上传'){
			$Toast({
				content: '你好,请先上传,才可复制呃~',
				type: 'warning'
			});
		}else{
			wx.setClipboardData({
				data: imgPath,
				success(res) {
					wx.getClipboardData({
						success(res) {
							console.log(res.data) // data
						}
					})
				}
			})
		}
	}
})