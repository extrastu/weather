const AV = require('../../utils/av-live-query-weapp-min')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    src:"",
    count:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      console.log(options)
      
      let object = JSON.parse(options.data);
      let _id =object.id;
      let views = object.index+1;
      console.log(views)
      console.log(object);
      this.setData({
          count: views
      })
      var todo = AV.Object.createWithoutData('pic', _id);
      todo.set('views',0);
      todo.save().then(function (todo) {
          todo.increment('views', views);
          todo.fetchWhenSave(true);
          return todo.save();
      }).then(function (todo) {
          // 使用了 fetchWhenSave 选项，save 成功之后即可得到最新的 views 值
      }, function (error) {
          // 异常处理
      });
      this.setData({
          src: object.src
      });
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
  // 点击图片进行预览
  previewImg: function (e) {
    console.log(e)
    
    var src = e.currentTarget.dataset.src
    console.log(src)
    var srcArr = [];
    srcArr.push(src);
    console.log(srcArr)
    wx.previewImage({
        current: src, //当前图片地址
        urls: srcArr, //所有要预览的图片的地址集合 数组形式
        success: function (res) { },
        fail: function (res) { },
        complete: function (res) { }
    })

  }
})