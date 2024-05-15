import { Telegraf, Scenes, Context } from 'telegraf'
import dotenv from 'dotenv'

dotenv.config()

interface MyContext extends Context {
    scene: Scenes.SceneContextScene<MyContext>,
    sessionDB: any
}

export const bot: Telegraf<MyContext> = new Telegraf(process.env.MANAGE_BOT_TOKEN)
export const manageBot: Telegraf<MyContext> = new Telegraf(process.env.MANAGE_BOT_TOKEN)
