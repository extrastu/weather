// pages/sm/sm.js
const app = getApp()
const {
  $Toast
} = require('../../dist/base/index');
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
    imgPath: "点击上方按钮开始上传",
    spinShow: false,
    isShow: false,
    isAdmin: false,
    fruit: [{
      id: 1,
      name: 'wallpaper',
    }, {
      id: 2,
      name: 'feature'
    }],
    current: 'wallpaper',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
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
                  console.log('[云函数] [login] user openid: ', res.result.openid)
                  app.globalData.openid = res.result.openid;
                  if (app.globalData.openid == 'oOXrt0DX_6yo3dTmJbXhssRBwGcA') {
                    console.log('是管理员登录')
                    this.setData({
                      isAdmin: true
                    })
                  }
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
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  selectImg: function() {
    let that = this
    let result = "";
    let base64Url = "";
    wx.chooseImage({
      success: ret => {
        wx.getFileSystemManager().readFile({
          filePath: ret.tempFilePaths[0], //选择图片返回的相对路径
          encoding: 'base64', //编码格式
          success: res => { //成功的回调
            base64Url = 'data:image/png;base64,' + res.data;
            that.setData({
              spinShow: true
            })
            wx.request({
              url: 'https://api.nuolkj.com/imgfile',
              method: "POST",
              header: {
                "content-type": "application/x-www-form-urlencoded"
              },
              data: {
                code: "weibo",
                img: base64Url,
                uid: 'A5255D37E4D640528D450BA2D716E490'
              },
              success: res => {
                console.log(res)
                that.setData({
                  spinShow: false,
                  imgPath: res.data.data,
                  isShow: true
                })
                wx.setClipboardData({
                  data: res.data.data,
                  success(res) {
                    wx.getClipboardData({
                      success(res) {
                        console.log(res.data) // data
                      }
                    })
                  }
                })
              }
            })
          }
        })

        // var filePath = ret.tempFilePaths[0];
        // console.log(filePath)

        // wx.uploadFile({
        //   url: 'https://www.extrastu.xin/sm',
        //   filePath: filePath,
        //   name: 'smfile',
        //   success: res => {
        //     // console.log('上传成功：', JSON.parse(res.data) );
        //     console.log(res)
        //     result = JSON.parse(res.data)
        //     console.log(result.data)
        //     that.setData({
        //       imgPath: result.data.url
        //     })
        //     that.setData({
        //       spinShow: false
        //     })
        //     wx.setClipboardData({
        //       data: result.data.url,
        //       success(res) {
        //         wx.getClipboardData({
        //           success(res) {
        //             console.log(res.data) // data
        //           }
        //         })

        //       }
        //     })
        //   }
        // });
      }
    })
  },
  doCopy: function(e) {
    let imgPath = e.currentTarget.dataset.link
    if (imgPath == '点击上方按钮开始上传') {
      $Toast({
        content: '你好,请先上传,才可复制呃~',
        type: 'warning'
      });
    } else {
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
  },
  updateToUser() {
    this.doAdd(this.data.current, 'extrastu', 'extrastu', '精选壁纸', this.data.imgPath)
  },
  doAdd: function(dbName, tag1, author1, des1, id) {
    let that = this;
    const db = wx.cloud.database()
    db.collection(dbName).add({
      data: {
        tag: tag1,
        author: author1,
        des: des1,
        createdAt: new Date(),
        url: id,
        downloadURL: id
      },
      success: res => {
        // 在返回结果中会包含新创建的记录的 _id
        wx.showToast({
          title: '约稿成功'
        })
        that.setData({
          isShow: false
        })
        console.log('[数据库] [新增记录] 成功，记录 _id: ', res._id)
      },
      fail: err => {
        console.error('[数据库] [新增记录] 失败：', err)
      }
    })
  },
  handleFruitChange({
    detail = {}
  }) {
    console.log(detail.value)
    this.setData({
      current: detail.value
    });
  }
  
})