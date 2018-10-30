// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const MAX_LIMIT = 10
const db = cloud.database()
// 云函数入口函数
exports.main = async(event, context) => {
    let page = event.page
    let limit = event.limit
	const countResult = await db.collection('wallpaper').count()
	const total = countResult.total
    try {
        return await db.collection('wallpaper')
			.orderBy('createdAt', 'desc')
			.limit(MAX_LIMIT).skip(page*limit)
            .get({
                sucess: (res) => {
                    return res;
                    console.log(event)
                }
            })
    } catch (e) {
        console.error(e)
    }
}