// pages/sendMessage/sendMessage.js
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
        value1: '',
        value2: '',
        value3: '',
		value4:""
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {

    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {
        wx.vibrateShort()
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

    },
    changeTitle: function(e) {
        this.setData({
            value1: e.detail.detail.value
        })
    },
    changeNum: function(e) {
        this.setData({
            value2: e.detail.detail.value
        })
    },
    changeStyle: function(e) {
        this.setData({
            value3: e.detail.detail.value
        })
    },
	changeTime: function (e) {
		this.setData({
			value4: e.detail.detail.value
		})
	},
    sendMessage: function(e) {
		console.log(e)
		console.log(e.detail.formId)
		let that = this
		wx.request({
			url: 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=wx0480ec46ceac69b4&secret=0056178dc6967344c4dfb8f2cf200846', 
			header: {
				'content-type': 'application/json' // 默认值
			},
			success(res) {
				console.log(res.data)
				let token = res.data.access_token
				wx.request({
					url: 'https://api.weixin.qq.com/cgi-bin/message/wxopen/template/send?access_token='+token, 
					data: {
						"touser":"oOXrt0DX_6yo3dTmJbXhssRBwGcA",
						"template_id": "E03Sm6eAIQ5ouHHBEVlu4FZsur-M6iLvWISg1w4C2jQ",
						"page": "/pages/home/home",
						"form_id": e.detail.formId,         //点击from表单提交按钮获取到的formId，上面说了
						"data": {
							"keyword1": {
								"value": that.data.value1,
								
							},
							"keyword2": {
								"value": that.data.value2,
							},
							"keyword3": {
								"value": that.data.value3,
							},
							"keyword4": {
								"value": that.data.value4,
							}
						},//模板消息的固定内容格式
						"emphasis_keyword": "keyword1.DATA" //需要放大的消息
					},
					header: {
						'content-type': 'application/json' // 默认值
					},
					method: "POST",
					success(res) {
						console.log(res.data)
					}
				})
			}
		})
	}
})