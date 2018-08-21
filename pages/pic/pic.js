const AV = require('../../utils/av-live-query-weapp-min')
const LIMIT = 7

const {
    $Toast
} = require('../../dist/base/index')

Page({
    /**
     * 页面的初始数据
     */
    data: {
        wallpaper: [],
        isReachEnd: false,
        isLoading: false,
        offsetRange: 0, //用于统计分页加载数据,已经加载数据数量
        imgArr: [],
        spinShow: true,
        SkinStyle: '',
        OneStyle:true
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
        // wx.showLoading({
        //     title: '加载中',
        // })
        // this.fetchPhotos()
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        let that = this
        that.fetchPhotos()
        wx.getStorage({
            key: 'skins',
            success: function (res) {
                that.setData({
                    SkinStyle: res.data
                })
            }
        })

        wx.getStorage({
            key: 'OneStyle',
            success: function (res) {
                console.log(res.data)
                that.setData({
                    OneStyle: res.data
                })
            }
        })
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {},

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {},

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {
        this.setData({
            wallpaper: []
        })
        wx.stopPullDownRefresh()
        this.fetchPhotos()
        wx.vibrateShort()
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
        var that = this
        let imgList = []
        //  console.log("到底了")
        //计算已经加载的数据
        if (that.data.isReachend) {
            return
        }
        let offsetRange = that.data.offsetRange + LIMIT
        that.setData({
            offsetRange: offsetRange,
            isLoading: true //正在加载
        })
        new AV.Query('pic')
            .descending('createdAt')
            .limit(LIMIT)
            .skip(that.data.offsetRange)
            .find()
            .then(data => {
                let objects = data
                if (objects.lengths == 0) {
                    that.setData({
                        isReachEnd: true, //已经获取全部数据
                        isLoading: false, //加载结束,
                        spinShow: false
                    })
                } else {
                    for (let i = 0; i < data.length; i++) {
                        let object = data[i]
                        let res = object._serverData.urls
                        imgList.push(res)
                    }
                    that.setData({
                        wallpaper: that.data.wallpaper.concat(objects),
                        isLoading: false,
                        imgArr: that.data.imgArr.concat(imgList),
                        spinShow: false
                    })
                }
            })
            .catch(console.error)
    },
    fetchPhotos: function () {
        var that = this
        let imgList = []
        new AV.Query('pic')
            .descending('createdAt')
            .limit(7)
            .find()
            .then(data => {
                for (let i = 0; i < data.length; i++) {
                    let object = data[i]
                    let res = object._serverData.urls
                    imgList.push(res)
                }
                wx.hideLoading()

                that.setData({
                    wallpaper: data,
                    imgArr: imgList,
                    spinShow: false
                })
            })
            .catch(console.error)
    },
    // 点击喜欢
    likeThis: function (e) {
        $Toast({
            content: '感谢你的支持,该功能暂未开放~',
            icon: 'like_fill'
        })
        console.log(e)
        var todo = AV.Object.createWithoutData('pic', e.currentTarget.id);
        todo.set('views', 0);
        todo.save().then(function (todo) {
            todo.increment('views', 1);
            todo.save(true);
            // return todo.save();
        }).then(function (todo) {
            // 使用了 fetchWhenSave 选项，save 成功之后即可得到最新的 views 值
            console.log(todo)
        }, function (error) {
            // 异常处理
        });
    },
    //下载壁纸
    downloadThis: function (e) {
        console.log(e)
        $Toast({
            content: '感谢你的支持,该功能暂未开放~',
            icon: 'like_fill'
        })
        //下载域名暂时没有启用https,因此放弃了
        // wx.downloadFile({
        //     url: e.currentTarget.dataset.src, //仅为示例，并非真实的资源
        //     success: function (res) {
        //         // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
        //         if (res.statusCode === 200) {
        //             wx.playVoice({
        //                 filePath: res.tempFilePath
        //             })
        //         }
        //     }
        // })
    },
    // 点击图片进行预览
    previewImg: function (e) {
        // $Toast({
        //     content: '在图片预览界面长按保存,然后在系统相册使用',
        //     icon: 'like_fill'
        // })
      

        // console.log(e.currentTarget.dataset.index)
        // var index = e.currentTarget.dataset.index
        // var imgArr = this.data.imgArr
        // wx.previewImage({
        //     current: imgArr[index], //当前图片地址
        //     urls: imgArr, //所有要预览的图片的地址集合 数组形式
        //     success: function (res) {},
        //     fail: function (res) {},
        //     complete: function (res) {}
        // })
        console.log(e)
        let data = JSON.stringify(e.currentTarget.dataset);
        wx.navigateTo({
            url: '../this/this?data=' + data
        })
    },
    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {
        if (res.from === 'button') {
            // 来自页面内转发按钮
            console.log(res.target)
        }
        return {
            title: '每图',
            path: '/pic.wxml',
            success: function (res) {
                // 转发成功
                wx.showToast({
                    title: '三克油~',
                    icon: 'success',
                    duration: 2000
                })
            },
            fail: function (res) {
                // 转发失败
                wx.showToast({
                    title: '要放弃么？主人~',
                    icon: 'cancel',
                    duration: 2000
                })
            }
        }
    }
})