import { Telegraf, Scenes, Context } from 'telegraf'
import dotenv from 'dotenv'
import { HttpsProxyAgent } from 'https-proxy-agent'

dotenv.config()

interface MyContext extends Context {
    scene: Scenes.SceneContextScene<MyContext>,
    sessionDB: any
}

// export const bot: Telegraf<MyContext> = new Telegraf(process.env.MANAGE_BOT_TOKEN, {
//     telegram: {
//         apiRoot: 'https://dark-office-telbot.liara.run/',
//         agent: new HttpsProxyAgent('https://t.me/proxy?server=irancell.irancell.irancell.irancell.irancell.iraell.irancell.irancell.irancell.irancell.irancell.irancell.irancell.irancell.irancell.irancell.irancell.irancell.irancell.irancell.irancell.irancell.irancell.irancell.irancell.irancell.irance.eletimes.space.&port=443&secret=7gAAAAAAAAAAAAAAAAAAAAB0Z2p1Lm9yZw%3D%3D')
//     }
// })
export const bot: Telegraf<MyContext> = new Telegraf(process.env.MANAGE_BOT_TOKEN)
