//app.js
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
        wx.getSystemInfo({
            success: (res) => {
                this.globalData.height = res.statusBarHeight
				this.globalData.dh = res.screenHeight
            }
        })
       
    },
	globalData : {
		share: false, // 分享默认为false
		height: 0,
		dh:0,
		isAgree:false
	}
})