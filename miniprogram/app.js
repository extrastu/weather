//app.js
require('./utils/vRequest.js')
App({
  onLaunch: function(options) {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        traceUser: true,
      })
    }
    
    // 判断是否由分享进入小程序
    if (options.scene == 1007 || options.scene == 1008) {
      this.globalData.share = true
    } else {
      this.globalData.share = false
    };
    
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
                  if (res.result.openid == 'oOXrt0DX_6yo3dTmJbXhssRBwGcA') {
                    console.log('是管理员');
                   
                  }else{
                    console.log('不是管理员')
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
    wx.setStorage({ //设置author
      key: 'isAuth',
      data: false,
    })
    wx.getSystemInfo({
      success: (res) => {
        this.globalData.height = res.statusBarHeight
        this.globalData.dh = res.screenHeight
      }
    })

  },
  globalData: {
    share: false, // 分享默认为false
    height: 0,
    dh: 0,
    isAgree: false,
    isAuthorization: false,
    openid: undefined,
    loadingImg: "http://ww1.sinaimg.cn/large/af7053bfgy1fx8ylmwec4j20b60dva9z.jpg",
    isEnd: true
  }
})