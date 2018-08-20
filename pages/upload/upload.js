const AV = require('../../utils/av-live-query-weapp-min');
var that;
Page({
    data: {
        images: [],
        uploadedImages: [],
        imageWidth: "",
        type: ""
    },
    onLoad: function (options) {
        that = this;
        var objectId = options.objectId;
        console.log(objectId);
        wx.getStorage({
            key: 'width',
            success: function (res) {
                console.log(res)
                that.setData({
                    imageWidth: (res.data/4)-10
                })
            }
        })

    },
    //当input失去焦点时,赋值
    changeVal: function (e) {
        console.log(e);
        console.log(e.detail.detail.value);
        this.setData({
            type: e.detail.detail.value
        })
    },
    chooseImage: function () {
        // 选择图片
        wx.chooseImage({
            sizeType: ['compressed'],
            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
            success: function (res) {
                // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
                var tempFilePaths = res.tempFilePaths;
                console.log(tempFilePaths);
                that.setData({
                    images: that.data.images.concat(tempFilePaths)
                });
            }
        })
    },
    previewImage: function () {
        // 预览图集
        wx.previewImage({
            urls: that.data.images
        });
    },
    submit: function () {
        // 提交图片，事先遍历图集数组
        let types = this.data.type;
        that.data.images.forEach(function (tempFilePath) {
            new AV.File('file-name', {
                blob: {
                    uri: tempFilePath,
                },
            }).save().then(
                function (file) {
                    var pic = AV.Object.extend('pic');
                    // 新建对象
                    var newPic = new pic();
                    // 设置名称
                    newPic.set('urls', file.url());
                    newPic.set('type', types);
                    // 设置优先级
                    newPic.set('priority', 1);
                    newPic.save().then(function (data) {
                        console.log(data);
                        wx.showToast({
                            title: '主人我更丰满了~', //提示信息
                            icon: 'success', //成功显示图标
                            duration: 1000 //时间
                        })
                    }, function (error) {
                        console.error(error);
                    });
                }
                
            ).catch(console.error);
        });
        wx.showToast({
            title: '评价成功',
            success: function () {
                wx.navigateBack();
            }
        });
    },
    delete: function (e) {
        var index = e.currentTarget.dataset.index;
        var images = that.data.images;
        images.splice(index, 1);
        that.setData({
            images: images
        });
    }
})