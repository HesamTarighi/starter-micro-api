import './modules/global'
// import dotenv from 'dotenv'
import { Scenes } from 'telegraf'
import { bot } from './config/bot.config'
import { BaseScenes, WizardScene } from './scene/scene'
import LocalSession from 'telegraf-session-local'
import { Admin, User } from './modules/panels'
import { EToggleChat } from './enums/enums'
import { dynamicText, sendGroupMessage } from './modules/chat'
import { ILocalSession } from './interface/session'

const localSession: ILocalSession = new LocalSession<any> ({
    database: process.env.DATABASE_PATH,
    state: { groups: {}, users: [], admins: [] } 
})
const stage: any = new Scenes.Stage([
    BaseScenes.SetOpenChatTimer(), BaseScenes.SetStopChatTimer(), BaseScenes.SetExpirePlanYear(), BaseScenes.SetMemberJoinText(), BaseScenes.SetOpenChatText(),
    BaseScenes.SetStopChatText(), BaseScenes.SetExpiredPlanText(), BaseScenes.SetNewAdmin(), BaseScenes.RemoveAdmin(), BaseScenes.SetNewGroup(), BaseScenes.RemoveGroup(),
    WizardScene.SetChatCondition, WizardScene.SetOpenChatTimer, WizardScene.SetStopChatTimer
])

// init usage
// dotenv.config()
bot.use(localSession.middleware())
bot.use(stage.middleware())
// timers
setInterval(() => {
    for (const group of localSession.DB.__wrapped__.groups.groups) {        
        if (group.toggleChat === EToggleChat.TIMER) {
            // send notif during start or stop chat
            if (new Date().getHours() == Number(group.openChatHour) && new Date().getMinutes() == 0) {
                sendGroupMessage(group.info.id, dynamicText(localSession.DB.__wrapped__.groups.openChatText, { openChatHour: group.openChatHour }))
            }
            if (new Date().getHours() == Number(group.stopChatHour) && new Date().getMinutes() == 0) {
                sendGroupMessage(group.info.id, dynamicText(localSession.DB.__wrapped__.groups.stopChatText, { stopChatHour: group.stopChatHour }))
            }
            
            // send notif before start or stop chat
            if (new Date().getHours() + 1 == Number(group.openChatHour) && new Date().getMinutes() == 50) {
                sendGroupMessage(group.info.id, '10 دقیقه دیگر گروه باز میشود')
            }
            if (new Date().getHours() + 1 == Number(group.stopChatHour) && new Date().getMinutes() == 50) {
                sendGroupMessage(group.info.id, `هشدار!⚠️
                تا شروع ساعتی خاموشی ده دقیقه مانده است، پس از این تایم گروه بسته خواهد شد.`)
            }
        }
    }
}, 60000)

// manage commands
Admin.useCommands().setChatConditionCommand()
Admin.useCommands().setOpenChatTimeCommand()
Admin.useCommands().setStopChatTimeCommand()
Admin.useCommands().setExpirePlanYearCommand()
Admin.useCommands().showChatCondition()
Admin.useCommands().setMemberJoinTextCommand()
Admin.useCommands().setOpenChatTextCommand()
Admin.useCommands().setStopChatTextCommand()
Admin.useCommands().setExpiredPlanTextCommand()
Admin.useCommands().setNewAdmin()
Admin.useCommands().removeAdmin()
Admin.useCommands().showAdmins()
Admin.useCommands().setNewGroup()
Admin.useCommands().removeGroup()
Admin.useCommands().showGroups()

// manage events
User.useCommands().startCommand()
User.useEvents().onMemberJoined()
User.useEvents().onSendMessageToGroup()

bot.launch()
