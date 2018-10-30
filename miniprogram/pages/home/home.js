// pages/home/home.js

const app = getApp()
const { $Toast } = require('../../dist/base/index');
// wx.request({
// 	url: 'https://rsshub.app/jike/topic/584bff068b6d5b0010ab96b7.json', //仅为示例，并非真实的接口地址
// 	header: {
// 		'content-type': 'application/json' // 默认值
// 	},
// 	success(res) {
		
// 		// console.log(res.data)
// 		for (let i of res.data.items){
// 			console.log(i.summary)
// 			let str = i.summary
// 			let regexType = /https:\/\/cdn.ruguoapp.com\/(\S*)?imageMogr2\/auto-orient\/strip\/format\/webp&#34/g
// 			let matchType = regexType.exec(i.summary)
// 			console.log(matchType)
// 		}
// 	}
// })
Page({

    /**
     * 页面的初始数据
     */
    data: {
        nvabarData: {
            showCapsule: 1, //是否显示左上角图标
            title: '', //导航栏 中间的标题
            isBackShow: "true"
        },
        // 此页面 页面内容距最顶部的距离
        height: app.globalData.height * 2 + 20,
        style: "one",
        page: 0,
        limit: 10,
        latests: [],
        spinShow: true,
        scrollTop: 0,
        floorstatus: false,
        dh: app.globalData.dh,
		randomSrc: "",
		exploreArr:[],
		visible: false,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        let that = this
		wx.vibrateShort()
        that.getList(this.data.page, this.data.limit, (res) => {
            that.setData({
                latests: res,
                spinShow: false
            })
        })
		that.onQuery()

		wx.getSetting({
			success: res => {
				if (res.authSetting['scope.userInfo']) {
					// 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
					wx.getUserInfo({
						success: res => {
							wx.vibrateShort()
							// console.log(res)
							
							wx.cloud.callFunction({
								name: 'login',
								data: {},
								success: res => {
									console.log('[云函数] [login] user openid: ', res.result.openid)
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
		wx.vibrateShort()
		console.log('--------下拉刷新-------')
		let that = this
		wx.vibrateShort()
		that.setData({
			latests: [],
			spinShow: true
		})
		that.getList(this.data.page, this.data.limit, (res) => {
			that.setData({
				latests: res,
				spinShow: false
			})
		})
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {
		wx.vibrateShort()
        wx.showLoading()
        let currentPage = this.data.page + 1
        this.getList(currentPage, this.data.limit, (res) => {
            this.setData({
                latests: this.data.latests.concat(res),
                page: currentPage,
                spinShow: false
            })
            wx.hideLoading()
        })
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
    //查询数据
    getList: (limit1, page1, callback) => {
        let that = this
        wx.cloud.callFunction({
            name: 'getWallpaper',
            data: {
                limit: limit1,
                page: page1
            },
            complete: res => {
                // console.log('云端函数返回数据',res.result.data)
                if (callback) {
                    callback(res.result.data);
                }
            }
        })
    },
    //返回顶部
    goTop: function(e) {
		wx.vibrateShort()
        if (wx.pageScrollTo) {
            wx.pageScrollTo({
                scrollTop: 0
            })
        } else {
            wx.showModal({
                title: '提示',
                content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
            })
        }
    },
    getMore: () => {
        wx.showLoading()
        let currentPage = this.data.page + 1
        this.getList(currentPage, this.data.limit, (res) => {
            this.setData({
                latests: this.data.latests.concat(res),
                page: currentPage,
                spinShow: false
            })
            wx.hideLoading()
        })
    },
    // 获取滚动条当前位置
    onPageScroll: function(e) {
        if (e.scrollTop > 100) {
            this.setData({
                floorstatus: true,
				nvabarData: {
					showCapsule: 1, //是否显示左上角图标
					title: '每图', //导航栏 中间的标题
					isBackShow: "true"
				}
            });
        } else {
            this.setData({
                floorstatus: false,
				nvabarData: {
					showCapsule: 1, //是否显示左上角图标
					title: '', //导航栏 中间的标题
					isBackShow: "true"
				}
            });
        }
    },
    //点击预览图片
    // previewImg: function(e) {
    //     wx.vibrateShort()
    //     var imgArr = []
    //     imgArr.push(e.currentTarget.dataset.src)
    //     wx.previewImage({
    //         current: e.currentTarget.dataset.src, //当前图片地址
    //         urls: imgArr, //所有要预览的图片的地址集合 数组形式
    //         success: function(res) {},
    //         fail: function(res) {},
    //         complete: function(res) {}
    //     })

    // }
	previewImg: function (e) {
		wx.vibrateShort()
		
		let idx = e.currentTarget.dataset.index
		let photos = this.data.latests
		
		wx.setStorage({ 
			key: 'photos',
			data: photos
		})
		wx.navigateTo({
			url: '../details/index?idx='+idx 
		})
	},
	intoThis:(e)=>{
		let type = e.currentTarget.dataset.type
		wx.navigateTo({
			url: '../types/types?type=' + type
		})
	},
	handleOpen() {
		this.setData({
			visible: true
		});
	},
	handleClose() {
		this.setData({
			visible: false
		});
	},
	openAlert(){
		$Toast({
			content: '正在开发中'
		});
	},
	onQuery: function () {
		const db = wx.cloud.database()
		db.collection('tabList').where({}).limit(12).orderBy('_id', 'desc').get({
			success: res => {
				this.setData({
					exploreArr: res.data,
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
	},
	toList:()=>{
		wx.navigateTo({
			url: '../list/list'
		})
	}
})