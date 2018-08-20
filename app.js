//app.js
const AV = require('utils/av-live-query-weapp-min')

AV.init({
  appId: 'j8dr4m11hsN1Hiy1H4h9mEgO-gzGzoHsz',
  appKey: 'O2B4GUr6NxngBuvtKm5BEPfj'
})
App({
  onLaunch: function () {
    // 登录
    //   AV.User.loginWithWeapp();
    // 设备信息
      wx.getSystemInfo({
          success: function (res) {
            //   console.log(res)
              wx.setStorage({ //设置storage
                  key: 'width',
                  data: res.windowWidth,
              })
          }
      })
   

  },
  globalData: {
    userInfo: null,
    skin: "normal",
    screenWidth:""
  },
  getSkin: function () {
    var that = this
    wx.getStorage({
      key: 'skin',
      success: function (res) {
        that.globalData.skin = res.data
      }
    })
  },

})