// 云函数入口文件
const cloud = require('wx-server-sdk')
const TcbRouter = require('tcb-router');
cloud.init()

// 云函数入口函数
exports.main = async(event, context) => {
    const app = new TcbRouter({
        event
    });
    app.use(async(ctx, next) => {
        ctx.data = {};
        await next();
    });

    app.router('explore', async(ctx, next) => {

        // ctx.body 返回数据到小程序端
        const countResult = await db.collection('tabList').count()
        const total = countResult.total
        await db.collection('tabList')
            .orderBy('createdAt', 'desc')
            .limit(MAX_LIMIT).skip(page * limit)
            .get()
	}, async (ctx) => {
        ctx.body = {
            code: 0,
            data: ctx.data
        };
    });

    app.router('login', async(ctx, next) => {
        await next();
    }, async(ctx, next) => {
        await next();
    }, async(ctx) => {
        ctx.body = {
            code: 0,
            message: 'login success'
        }
    });

    return app.serve();
}