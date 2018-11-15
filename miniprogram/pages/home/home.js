// pages/home/home.js
import {
    formatTime
} from '../../utils/util.js'
const app = getApp()
const {
    $Toast
} = require('../../dist/base/index');


function setRegular(targetHour) {
    var timeInterval, nowTime, nowSeconds, targetSeconds

    nowTime = new Date()
    // 计算当前时间的秒数
    nowSeconds = nowTime.getHours() * 3600 + nowTime.getMinutes() * 60 + nowTime.getSeconds()

    // 计算目标时间对应的秒数
    targetSeconds = targetHour * 3600

    //  判断是否已超过今日目标小时，若超过，时间间隔设置为距离明天目标小时的距离
    timeInterval = targetSeconds > nowSeconds ? targetSeconds - nowSeconds : targetSeconds + 24 * 3600 - nowSeconds
    console.log(timeInterval)
    setTimeout(getProductFileList, timeInterval * 1000)
}

function getProductFileList() {
    wx.request({
        url: 'https://www.extrastu.xin/bin', //仅为示例，并非真实的接口地址
        method: "post",
        header: {
            'content-type': 'application/json' // 默认值
        },
        success(res) {
            console.log(res)
            let result = res.data
            let photoArr = []
            photoArr.push(result.imageUrl)
            console.log(photoArr)
            const db = wx.cloud.database()
            db.collection('wallpaper').add({
                data: {
                    url: result.imageUrl,
                    createdAt: new Date,
                    author: 'bing',
                    column: '今日必应',
                    downloadUrl: "",
                    from: "bing",
                    title: result.title,
                    type: "bing",
                    photoArr: photoArr
                },
                success: res => {

                    console.log('[数据库] [新增记录] 成功，记录 _id: ', res._id)
                },
                fail: err => {
                    // wx.showToast({
                    // 	icon: 'none',
                    // 	title: '新增记录失败'
                    // })
                    console.error('[数据库] [新增记录] 失败：', err)
                }
            })
        }
    })
    console.log(1231, '到了中午12点执行查询操作')

    setTimeout(getProductFileList, 24 * 3600 * 1000) //之后每天调用一次
}
// setRegular(8); //比如目标是每天早上8点

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
        exploreArr: [],
        visible: false,
        hotArr: [],
		notice:"",
		spinShow1:true
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
			let latests = that.data.latests
			for (let i = 0; i < latests.length; i++) {
				let time = formatTime(latests[i].createdAt)
				var str = 'latests[' + i + '].createdAt'
				that.setData({
					[str]: time
				})
			}

        })
        that.onQuery();
        that.fetchHot();
		that.queryNotice();
		that.getRandom();
        wx.getSetting({
            success: res => {
                if (res.authSetting['scope.userInfo']) {
                    // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
                    wx.getUserInfo({
                        success: res => {
                            wx.vibrateShort()
                            wx.cloud.callFunction({
                                name: 'login',
                                data: {},
                                success: res => {
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
        let that = this
        wx.vibrateShort()
        that.setData({
            latests: [],
            spinShow: true,
            page: 0
        })
        that.getList(that.data.page, that.data.limit, (res) => {
            that.setData({
                latests: res,
                spinShow: false
            })
			let latests = that.data.latests
			for (let i = 0; i < latests.length; i++) {
				let time = formatTime(latests[i].createdAt)
				var str = 'latests[' + i + '].createdAt'
				that.setData({
					[str]: time
				})
			}
			
        })
		that.queryNotice();
		that.fetchHot();
		that.getRandom();
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
			let latests = this.data.latests
			for (let i = 0; i < latests.length; i++) {
				let time = formatTime(latests[i].createdAt)
				var str = 'latests[' + i + '].createdAt'
				this.setData({
					[str]: time
				})
			}
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
    checkImg: function(e) {
		let id = e.currentTarget.dataset.id
		console.log(id)
		this.onUpdateViews(id)
        wx.vibrateShort()
        var imgArr = []
        imgArr.push(e.currentTarget.dataset.src)
        wx.previewImage({
            current: e.currentTarget.dataset.src, //当前图片地址
            urls: imgArr, //所有要预览的图片的地址集合 数组形式
            success: function(res) {},
            fail: function(res) {},
            complete: function(res) {}
        })

    },
    previewImg: function(e) {
        wx.vibrateShort()

        let idx = e.currentTarget.dataset.index
        let photos = this.data.latests

        wx.setStorage({
            key: 'photos',
            data: photos
        })
        wx.navigateTo({
            url: '../details/index?idx=' + idx
        })
    },
    intoThis: (e) => {
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
    openAlert() {
		wx.navigateTo({
			url: '../search/search'
		})
    },
    onQuery: function() {
        const db = wx.cloud.database()
        db.collection('tabList').where({}).limit(12).orderBy('_id', 'desc').get({
            success: res => {
                this.setData({
                    exploreArr: res.data,
                    spinShow: false
                })
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
    toList: () => {
        wx.navigateTo({
            url: '../list/list'
        })
    },
    enterThisZL: (e) => {
        console.log(e)
        let id = e.currentTarget.dataset.id;
        wx.navigateTo({
            url: '../info/index?id=' + id
        })
    },
    // 添加一条数据
    onAdd: function(currSrc, time, author, column, title, photoArr) {
        let that = this
        const db = wx.cloud.database()
        db.collection('wallapper').add({
            data: {
                src: currSrc,
                createdAt: time,
                author: author,
                column: column,
                downloadUrl: "",
                from: "bing",
                title: title,
                type: "bing",
                photoArr: photoArr

            },
            success: res => {
                console.log('[数据库] [新增记录] 成功，记录 _id: ', res._id)
            },
            fail: err => {
                console.error('[数据库] [新增记录] 失败：', err)
            }
        })
    },
    timeFn: (d1) => { //di作为一个变量传进来
        //如果时间格式是正确的，那下面这一步转化时间格式就可以不用了
        var dateBegin = new Date(d1.replace(/-/g, "/")); //将-转化为/，使用new Date
        var dateEnd = new Date(); //获取当前时间
        console.log(dateBegin, '---', dateEnd)

        var dateDiff = dateEnd.getTime() - dateBegin.getTime(); //时间差的毫秒数
        var dayDiff = Math.floor(dateDiff / (24 * 3600 * 1000)); //计算出相差天数
        var leave1 = dateDiff % (24 * 3600 * 1000) //计算天数后剩余的毫秒数
        var hours = Math.floor(leave1 / (3600 * 1000)) //计算出小时数
        //计算相差分钟数
        var leave2 = leave1 % (3600 * 1000) //计算小时数后剩余的毫秒数
        var minutes = Math.floor(leave2 / (60 * 1000)) //计算相差分钟数
        //计算相差秒数
        var leave3 = leave2 % (60 * 1000) //计算分钟数后剩余的毫秒数
        var seconds = Math.round(leave3 / 1000)
        console.log(" 相差 " + dayDiff + "天 " + hours + "小时 " + minutes + " 分钟" + seconds + " 秒")
        console.log(dateDiff + "时间差的毫秒数", dayDiff + "计算出相差天数", leave1 + "计算天数后剩余的毫秒数", hours + "计算出小时数", minutes + "计算相差分钟数", seconds + "计算相差秒数");
    },
    // 获取热门数据
    fetchHot: function() {
        const db = wx.cloud.database()
        const _ = db.command
        db.collection('wallpaper').where({
            views: _.gt(0)
        }).limit(12).orderBy('views', 'desc').get({
            success: res => {
                this.setData({
                    hotArr: res.data,
                    spinShow: false
                })
				console.log('[数据库] [查询热门记录] 成功: ', res)

            },
            fail: err => {
                wx.showToast({
                    icon: 'none',
                    title: '查询记录失败'
                })
                console.error('[数据库] [查询热门记录] 失败：', err)
            }
        })
    },
	queryNotice: function () {
		let that = this
		const db = wx.cloud.database()
		db.collection('notice').where({ isDisplay:false}).limit(1).get({
			success: res => {
				console.log('[数据库] [查询公告记录] 成功: ', res)
				that.setData({
					notice: res.data[0].content + " By " + res.data[0].author + " ~ " + formatTime(res.data[0].createdAt),
					spinShow: false
				})
			},
			fail: err => {
				wx.showToast({
					icon: 'none',
					title: '查询公告记录失败'
				})
				console.error('[数据库] [查询公告记录] 失败：', err)
			}
		})
	},
	onUpdateViews: function (id) {
		const db = wx.cloud.database()
		const _ = db.command
		db.collection('wallpaper').doc(id).update({
			data: {
				views: _.inc(1)
			},
			success: res => {
				console.info('[数据库] [更新记录] 成功：', res)
			},
			fail: err => {
				icon: 'none',
					console.error('[数据库] [更新记录] 失败：', err)
			}
		})
	},
	getRandom:function(){
		let that = this
		wx.request({
			url: 'https://www.extrastu.xin/photos/random',
			method: "post",
			header: {
				'content-type': 'application/json' // 默认值
			},
			success(res) {
				// console.log(res)
				that.setData({
					randomSrc: res.data.urls.regular,
					spinShow1:false
				})
			}
		})
	}
})