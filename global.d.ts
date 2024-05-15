namespace NodeJS {
    interface ProcessEnv {
        NODE_ENV: string
        BOT_TOKEN: string
        MANAGE_BOT_TOKEN: string
        DATABASE_PATH: string
    }
}

declare global {
    var groupId: string
    var botId: string
    var localSession: any

    namespace NodeJS {
        interface ProcessEnv {
            NODE_ENV: string
            BOT_TOKEN: string
            MANAGE_BOT_TOKEN: string
            DATABASE_PATH: string
        }
    }
}

export {  }
  