var bmap = require('../../utils/bmap-wx.min.js');
var network = require('../../utils/network.js');
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
        this.fetchPhotos();
        // let url = "https://api.map.baidu.com/telematics/v3/weather",
        // d={
        //     location : "新县", ak :"iLvtf4UlqQW1KrRZjCGrK1VFnhxebSZH"
        // };
           
        // network._get(url, d,function(res){
        //     console.log(res)
        // })
        // wx.request({
        //     url: 'https://api.map.baidu.com/telematics/v3/weather', //接口地址
        //     data: {
        //         ak: 'iLvtf4UlqQW1KrRZjCGrK1VFnhxebSZH',
        //         location: '新县'
        //     },
        //     header: {
        //         'content-type': 'application/json' // 默认值
        //     },
        //     success: function (res) {
        //         console.log(res.data)
        //     }
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
        wx.showToast({
            title: '没事儿别乱拽',//提示信息
            icon: 'success',//成功显示图标
            duration: 1000//时间
        })
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
            console.log(nextDay)
            weatherData = '城市：' + weatherData.currentCity + '\n' + 'PM2.5：' + weatherData.pm25 + '\n' + '日期：' + weatherData.date + '\n' + '温度：' + weatherData.temperature + '\n' + '天气：' + weatherData.weatherDesc + '\n' + '风力：' + weatherData.wind + '\n';
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
                    rainy: true
                })
            }
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
    fetchPhotos:function(){
        wx.request({
            url: 'https://api.lylares.com/unsplash/?AppId=UlyslljgTb&w=640&h=480', //接口地址
            // data: {
            //     appID: '1f6a34b6d021ef8945e0809f15e69fc9a8537eae42942cd0e0ce5980a0fe3eaf',
            //     page: '1',
            //     per_page:"10"
            // },
            header: {
                'content-type': 'application/json' // 默认值
            },
            success: function (res) {
                console.log(res)
            }
        })
    }
})