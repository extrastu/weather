// pages/infinitynewtab/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nvabarData: {
      showCapsule: 1,
      title: 'infinity',
      isBackShow: "false"
    },
    files: [],
    ku: 'weibo',
    title: null,
    current: 'wallpaper',
    height: app.globalData.height * 2 + 20,
    dh: app.globalData.dh,
    page: 0,
    InfinityWallpapers: [],
    totalPage: null,
    total: null,
    categories: [],
    current_scroll: 36,
    tabs: ['收入', '支出', '通知', '我的'],
    stv: {
      windowWidth: 0,
      lineWidth: 0,
      offset: 0,
      tStart: false
    },
    activeTab: 0
  },
  onLoad(options) {
    this.get360Wallpaper();
    this.getAllCategories();
    try {
      let {
        tabs
      } = this.data;
      var res = wx.getSystemInfoSync()
      this.windowWidth = res.windowWidth;
      this.data.stv.lineWidth = this.windowWidth / this.data.tabs.length;
      this.data.stv.windowWidth = res.windowWidth;
      this.setData({
        stv: this.data.stv
      })
      this.tabsCount = tabs.length;
    } catch (e) {}
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    wx.vibrateShort();
  },
  previewImage: function (e) {
    console.log(e)
    let wallpapers = [];
    wallpapers.push(e.currentTarget.dataset.id)
    console.log(e.currentTarget.id, wallpapers)
    wx.previewImage({
      current: e.currentTarget.id, // 当前显示图片的http链接
      urls: wallpapers // 需要预览的图片http链接列表
    })
  },
  get360Wallpaper() {
    wx.showLoading({
      title: '加载中',
    })
    wx.vrequest({
      url: 'http://wallpaper.apc.360.cn/index.php?c=WallPaper&a=getAppsByOrder&order=create_time&start=' + this.data.page + '&count=30&from=360chrome',
      success: ret => {
        var res = JSON.parse(ret.data);
        var page = this.data.page + 1;
        this.setData({
          InfinityWallpapers: this.data.InfinityWallpapers.concat(res.data),
          total: res.total,
          page: page * 30
        })
        wx.hideLoading();
      }
    })
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.get360Wallpaper();
  },
  getAllCategories() {
    wx.showLoading({
      title: '加载中',
    })
    wx.vrequest({
      url: 'http://wallpaper.apc.360.cn/index.php?c=WallPaperAndroid&a=getAllCategories',
      success: ret => {
        var res = JSON.parse(ret.data);
        this.setData({
          categories: res.data
        })
        wx.hideLoading();
      }
    })
  },
  handleChangeScroll({
    detail
  }) {
    this.setData({
      current_scroll: detail.key
    });
  },
  getAppsByCategory() {
    wx.showLoading({
      title: '加载中',
    })
    wx.vrequest({
      url: 'http://wallpaper.apc.360.cn/index.php?c=WallPaperAndroid&a=getAppsByCategory&cid=' + this.data.current_scroll + '&start=' + this.data.page + '&count=99',
      success: ret => {
        var res = JSON.parse(ret.data);
        this.setData({
          categories: res.data
        })
        wx.hideLoading();
      }
    })
  },
  // onLoad: function (options) {
  //   try {
  //     let {
  //       tabs
  //     } = this.data;
  //     var res = wx.getSystemInfoSync()
  //     this.windowWidth = res.windowWidth;
  //     this.data.stv.lineWidth = this.windowWidth / this.data.tabs.length;
  //     this.data.stv.windowWidth = res.windowWidth;
  //     this.setData({
  //       stv: this.data.stv
  //     })
  //     this.tabsCount = tabs.length;
  //   } catch (e) {}
  // },
  handlerStart(e) {
    let {
      clientX,
      clientY
    } = e.touches[0];
    this.startX = clientX;
    this.tapStartX = clientX;
    this.tapStartY = clientY;
    this.data.stv.tStart = true;
    this.tapStartTime = e.timeStamp;
    this.setData({
      stv: this.data.stv
    })
  },
  handlerMove(e) {
    let {
      clientX,
      clientY
    } = e.touches[0];
    let {
      stv
    } = this.data;
    let offsetX = this.startX - clientX;
    this.startX = clientX;
    stv.offset += offsetX;
    if (stv.offset <= 0) {
      stv.offset = 0;
    } else if (stv.offset >= stv.windowWidth * (this.tabsCount - 1)) {
      stv.offset = stv.windowWidth * (this.tabsCount - 1);
    }
    this.setData({
      stv: stv
    });
  },
  handlerCancel(e) {

  },
  handlerEnd(e) {
    let {
      clientX,
      clientY
    } = e.changedTouches[0];
    let endTime = e.timeStamp;
    let {
      tabs,
      stv,
      activeTab
    } = this.data;
    let {
      offset,
      windowWidth
    } = stv;
    //快速滑动
    if (endTime - this.tapStartTime <= 300) {
      //向左
      if (Math.abs(this.tapStartY - clientY) < 50) {
        if (this.tapStartX - clientX > 5) {
          if (activeTab < this.tabsCount - 1) {
            this.setData({
              activeTab: ++activeTab
            })
          }
        } else {
          if (activeTab > 0) {
            this.setData({
              activeTab: --activeTab
            })
          }
        }
        stv.offset = stv.windowWidth * activeTab;
      } else {
        //快速滑动 但是Y距离大于50 所以用户是左右滚动
        let page = Math.round(offset / windowWidth);
        if (activeTab != page) {
          this.setData({
            activeTab: page
          })
        }
        stv.offset = stv.windowWidth * page;
      }
    } else {
      let page = Math.round(offset / windowWidth);
      if (activeTab != page) {
        this.setData({
          activeTab: page
        })
      }
      stv.offset = stv.windowWidth * page;
    }
    stv.tStart = false;
    this.setData({
      stv: this.data.stv
    })
  },
  _updateSelectedPage(page) {
    let {
      tabs,
      stv,
      activeTab
    } = this.data;
    activeTab = page;
    this.setData({
      activeTab: activeTab
    })
    stv.offset = stv.windowWidth * activeTab;
    this.setData({
      stv: this.data.stv
    })
  },
  handlerTabTap(e) {
    this._updateSelectedPage(e.currentTarget.dataset.index);
  }
})