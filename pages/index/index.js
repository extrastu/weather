var bmap = require('../../utils/bmap-wx.min.js');
var network = require('../../utils/network.js');
var AV = require('../../utils/av-live-query-weapp-min');
// var amapFile = require('../../utils/amap-wx.js');//如：..­/..­/libs/amap-wx.js
Page({
    data: {
        weatherData: '',
        currentCity:'',
        pm25:'',
        date:'',
        temperature:'',
        weatherDesc:'',
        wind:'',
        nextDay:'',
        firstDay:'',
        sunny:false,
        cloudy:false,
        rainy:false,
        snowy:false,
        rainbow:false,
        straay:false,
        stormy:false,
        urls:'http://oz53lzns9.bkt.clouddn.com/18-4-9/23231496.jpg'
    },
    onLoad: function () {
        this.getData();
        // let url = "https://api.map.baidu.com/telematics/v3/weather",
        // d={
        //     location : "新县", ak :"iLvtf4UlqQW1KrRZjCGrK1VFnhxebSZH"
        // };
        // network._get(url, d,function(res){
        //     console.log(res)
        // })
    },
    onPullDownRefresh: function () {
        this.getData();
        wx.stopPullDownRefresh();
        wx.vibrateShort();
        wx.showToast({
            title: '没事儿别乱拉',//提示信息
            icon: 'success',//成功显示图标
            duration: 1000//时间
        })
    },
    onReachBottom:function(){
        this.getData();
        wx.vibrateShort();
        // wx.showToast({
        //     title: '没事儿别乱拽',//提示信息
        //     icon: 'success',//成功显示图标
        //     duration: 1000//时间
        // })
    },
    getData:function(){
        var that = this;
        var BMap = new bmap.BMapWX({
            ak: 'iLvtf4UlqQW1KrRZjCGrK1VFnhxebSZH'
        });
        var fail = function (data) {
            console.log('fail!!!!')
        };
        var success = function (data) {

            var nextDay = data.originalData.results[0].weather_data;
            var weatherData = data.currentWeather[0];
            var weatherD = weatherData.date;
            var currentWeather = weatherD.substring(14, 17)//当前实时温度
            var FirstDay = (nextDay[0].date).substring(0, 2);
            // console.log(nextDay)
            weatherData = '城市：' + weatherData.currentCity + '\n' + 'PM2.5：' + weatherData.pm25 + '\n' + '日期：' + weatherData.date + '\n' + '温度：' + weatherData.temperature + '\n' + '天气：' + weatherData.weatherDesc + '\n' + '风力：' + weatherData.wind + '\n';
            //判断显示不同的天气动画
            if (data.currentWeather[0].weatherDesc == "晴") {
                that.setData({
                    sunny: true
                })
            } else if (data.currentWeather[0].weatherDesc == "多云转阴") {
                that.setData({
                    cloudy: true
                })
            } else if (data.currentWeather[0].weatherDesc == "多云转雨夹雪") {
                that.setData({
                    stormy: true
                })
            } else if (data.currentWeather[0].weatherDesc == "小雨") {
                that.setData({
                    rainy: true
                })
                
            } else if (data.currentWeather[0].weatherDesc == "阴") {
                that.setData({
                    rainy: true
                })
            } else if (data.currentWeather[0].weatherDesc == "晴转多云") {
                that.setData({
                    cloudy: true
                })
            } else if (data.currentWeather[0].weatherDesc == "多云") {
                that.setData({
                    cloudy: true
                })
            }
            else if (data.currentWeather[0].weatherDesc == "阴转下雨") {
                that.setData({
                    rainy: true
                })
            }
            else if (data.currentWeather[0].weatherDesc == "小雨转中雨") {
                that.setData({
                    rainy: true
                })
            }
           
            //设置值
            that.setData({
                weatherData: weatherData,
                currentCity: data.currentWeather[0].currentCity,
                pm25: data.currentWeather[0].pm25,
                date: data.currentWeather[0].date,
                temperature: currentWeather,
                weatherDesc: data.currentWeather[0].weatherDesc,
                wind: data.currentWeather[0].wind,
                nextDay: nextDay,
                firstDay: FirstDay
            });
        }
        BMap.weather({
            fail: fail,
            success: success
        });
    },
    //进入图片页
    bindViewPic: function () {
        wx.navigateTo({
            url: '../pic/pic'
        })
    },
    //上传图片并更新到数据库
    uploadImg:function(){
        wx.chooseImage({
            count: 9,
            sizeType: ['original', 'compressed'],
            sourceType: ['album', 'camera'],
            success: function (res) {
                // var tempFilePath = res.tempFilePaths[0];
                // new AV.File('file-name', {
                //     blob: {
                //         uri: tempFilePath,
                //     },
                // }).save().then(
                //     file => {
                //         console.log(file.url());
                //         var pic = AV.Object.extend('pic');
                //         // 新建对象
                //         var newPic = new pic();
                //         // 设置名称
                //         newPic.set('urls', file.url() );
                //         // 设置优先级
                //         newPic.set('priority', 1);
                //         newPic.save().then(function (data) {
                //             console.log('objectId is ' + data);
                //         }, function (error) {
                //             console.error(error);
                //         });
                //     }
                    
                //     ).catch(console.error);
                res.tempFilePaths.map(tempFilePath => () => new AV.File('filename', {
                    blob: {
                        uri: tempFilePath,
                    },
                }).save()).reduce(
                    (m, p) => m.then(v => AV.Promise.all([...v, p()])),
                    AV.Promise.resolve([])
                    ).then(files => console.log(files.map(file => {
                        console.log(file.url());
                        file.url()
                        var pic = AV.Object.extend('pic');
                        // 新建对象
                        var newPic = new pic();
                        // 设置名称
                        newPic.set('urls', file.url());
                        // 设置优先级
                        newPic.set('priority', 1);
                        newPic.save().then(function (data) {
                            console.log( data);
                        }, function (error) {
                            console.error(error);
                        });
                    }))).catch(console.error);
            }
        });
    },
    onShareAppMessage: function (res) {
        if (res.from === 'button') {
            // 来自页面内转发按钮
            console.log(res.target)
        }
        return {
            title: '每图',
            path: '/index.wxml',
            success: function (res) {
                // 转发成功
                wx.showToast({
                    title: '三克油~',
                    icon: 'success',
                    duration: 2000
                });
            },
            fail: function (res) {
                // 转发失败
                wx.showToast({
                    title: '要放弃么？主人~',
                    icon: 'cancel',
                    duration: 2000
                });
            }
        }
    }
})