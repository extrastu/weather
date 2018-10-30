// pages/my/my.js
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        nvabarData: {
            showCapsule: 1, //是否显示左上角图标
            title: '我的', //导航栏 中间的标题
            isBackShow: "true",
            bgColor: "skyblue"
        },
        // 此页面 页面内容距最顶部的距离
        height: app.globalData.height * 2 + 20,
        style: "one",
        avatarUrl: "../../images/icon-tab/avator.png",
        userInfo: {},
        logged: false,
        takeSession: false,
        requestResult: '',
        queryResult: [],
        limit: 10,
        page: 0,
        count: "",
		spinShow: true,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        // 获取用户信息
        wx.getSetting({
            success: res => {
                if (res.authSetting['scope.userInfo']) {
                    // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
                    wx.getUserInfo({
                        success: res => {
							wx.vibrateShort()
                            this.setData({
                                avatarUrl: res.userInfo.avatarUrl,
                                userInfo: res.userInfo
                            })
                            wx.cloud.callFunction({
                                name: 'login',
                                data: {},
                                success: res => {
                                    // console.log('[云函数] [login] user openid: ', res.result.openid)
                                    app.globalData.openid = res.result.openid
                                },
                                fail: err => {
                                    console.error('[云函数] [login] 调用失败', err)
                                }
                            })
                        }
                    })
                }
            }
        })
        this.onQuery(app.globalData.openid, this.data.limit)
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
		wx.vibrateShort()
        let limit1 = this.data.limit
        if (this.data.count >= 10) {
			let page1 = this.data.page + 1
			const db = wx.cloud.database()
			// 查询当前用户所有的 counters
			db.collection('footprint').where({
				_openid: openid
			}).limit(limit1).skip(page1 * 10).orderBy('startTime', 'desc').get({
				success: res => {
					this.setData({
						queryResult: this.data.queryResult.cancat(res.data),
						page: page1,
						spinShow: false
					})

					console.log('[数据库] [查询记录] 成功: ', res)
				},
				fail: err => {
					wx.showToast({
						icon: 'none',
						title: '查询记录失败'
					})
					console.error('[数据库] [查询记录] 失败：', err)
				}
			})
        }else{
			return false;
		}
        
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

    },
    // 点击切换展示形式
    changeStyle: function(e) {
        wx.vibrateShort()
        this.setData({
            style: e.currentTarget.dataset.style
        })
    },
    onGetUserInfo: function(e) {
        if (!this.logged && e.detail.userInfo) {
            this.setData({
                logged: true,
                avatarUrl: e.detail.userInfo.avatarUrl,
                userInfo: e.detail.userInfo
            })
        }
    },
    // 更具openid查询浏览足迹
    onQuery: function(openid, limit1) {
        const db = wx.cloud.database()
        db.collection('footprint').where({
            _openid: openid
        }).limit(limit1).orderBy('startTime', 'desc').get({
            success: res => {
                this.setData({
                    queryResult: res.data,
                    count: res.data.length,
					spinShow:false
                })
                console.log('[数据库] [查询记录] 成功: ', res)
            },
            fail: err => {
                wx.showToast({
                    icon: 'none',
                    title: '查询记录失败'
                })
                console.error('[数据库] [查询记录] 失败：', err)
            }
        })
    },
	previewImg: function (e) {
		wx.vibrateShort()
		let src = e.currentTarget.dataset.src
		wx.navigateTo({
			url: '../info/index?src=' + src
		})
	}
})