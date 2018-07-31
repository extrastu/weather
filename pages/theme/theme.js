var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {

    colors: [{
      id: 1,
      name: '蓝色',
      color: 'blue'
    }, {
      id: 2,
      name: '粉色',
      color: "pink"
    }, {
      id: 3,
      name: '紫色',
      color: 'purple'
    }, {
      id: 4,
      name: '黑色',
      color: 'black'
    }, {
      id: 5,
      name: '白色',
      color: 'white'
    }, {
      id: 6,
      name: '红色',
      color: 'red'
    }, {
      id: 7,
      name: "黄色",
      color: "yellow"
    }, {
      id: 8,
      name: '绿色',
      color: 'green'
    }, {
      id: 9,
      name: '灰色',
      color: 'grey'
    }, {
      id: 10,
      name: '棕色',
      color: 'brown'
    }],
    current: '黑色',
    position: 'left',
    animal: '熊猫',
    checked: false,
    disabled: false,
    SkinStyle: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    wx.getStorage({
      key: 'skins',
      success: function (res) {
        console.log(res.data)
        if (res.data == "black") {
          that.current = "黑色"
        } else if (res.data == 'purple') {
          that.current = "紫色"
        } else if (res.data == 'blue') {
          that.current = "蓝色"
        } else if (res.data == 'pink') {
          that.current = "粉色"
        } else if (res.data == 'white') {
          that.current = "白色"
        } else if (res.data == 'red') {
          that.current = "红色"
        } else if (res.data == 'yellow') {
          that.current = "黄色"
        } else if (res.data == 'green') {
          that.current = "绿色"
        } else if (res.data == 'grey') {
          that.current = "灰色"
        } else if (res.data == 'brown') {
          that.current = "棕色"
        }
        that.setData({
          SkinStyle: res.data
        })
      },
    })

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
    let that = this;
    wx.getStorage({
      key: 'skins',
      success: function (res) {
        console.log(res.data)
        if (res.data == "black") {
          that.current = "黑色"
        } else if (res.data == 'purple') {
          that.current = "紫色"
        } else if (res.data == 'blue') {
          that.current = "蓝色"
        } else if (res.data == 'pink') {
          that.current = "粉色"
        } else if (res.data == 'white') {
          that.current = "白色"
        } else if (res.data == 'red') {
          that.current = "红色"
        } else if (res.data == 'yellow') {
          that.current = "黄色"
        } else if (res.data == 'green') {
          that.current = "绿色"
        } else if (res.data == 'grey') {
          that.current = "灰色"
        } else if (res.data == 'brown') {
          that.current = "棕色"
        }
        that.setData({
          SkinStyle: res.data
        })
      },
    })
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
  handleAnimalChange({
    detail = {}
  }) {
    console.log(detail.current)
    this.setData({
      checked: detail.current
    });
  },
  handleFruitChange({
    detail = {}
  }) {
    console.log(detail.value);
    app.globalData.skin = detail.value;
    this.setData({
      current: detail.value,
      SkinStyle: app.globalData.skin
    });
    wx.setStorage({　　　　
      key: 'skins',
      　　　　data: app.globalData.skin,
      　　
    })
  }
})