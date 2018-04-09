var bmap = require('../../utils/bmap-wx.min.js');
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
        firstDay:''
    },
    onLoad: function () {
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
            var currentWeather = weatherD.substring(14,17)//当前实时温度
            var FirstDay = (nextDay[0].date).substring(0,2);
            console.log(nextDay)
            weatherData = '城市：' + weatherData.currentCity + '\n' + 'PM2.5：' + weatherData.pm25 + '\n' + '日期：' + weatherData.date + '\n' + '温度：' + weatherData.temperature + '\n' + '天气：' + weatherData.weatherDesc + '\n' + '风力：' + weatherData.wind + '\n';
            that.setData({
                weatherData: weatherData,
                currentCity: data.currentWeather[0].currentCity ,
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


    }
})