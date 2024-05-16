import moment from "jalali-moment"
import { bot } from "../config/bot.config"
import { IUser } from "../interface/session"

interface ICheckChatAdminPromise {
    isAdmin: boolean
}

interface ICheckUserPlan {
    isExpired: boolean
}

interface IDynamicText {
    expirePlanYear?: any
    user?: any
    openChatHour?: any
    stopChatHour?: any
}

export function expiredPlanDate (expirePlanYear: number): string {
    return `${(Number(moment().locale('fa').format('YYYY')) + expirePlanYear)}/${moment().locale('fa').format('MM/DD')}`
}

export function checkChatAdmin(chatId: number, userId: number) : Promise<ICheckChatAdminPromise> {
    return new Promise(resolve => {
        bot.telegram.getChatAdministrators(chatId)
        .then(admins => resolve({ isAdmin: admins.some(admin => admin.user.id == userId) }))
    })
}

export function checkUserPlan (users: any, userId: number): ICheckUserPlan {
    const getUser = users.find((user: IUser) => user.memberInfo.id == userId)
    
    if (getUser) {
        const getUserExpiredPlanDate = getUser.expired_plan_date.split('/').join('')
        const getNowDate = moment().locale('fa').format('YYYYMMDD')

        if (Number(getNowDate) > Number(getUserExpiredPlanDate)) return { isExpired: true }
        else return { isExpired: false }
    } else return { isExpired: false }
}

export function dynamicText (text: string, dynamic_text: IDynamicText ): string {
    var replacedText: string = text
    try {
        replacedText = replacedText.replace('__date', expiredPlanDate(dynamic_text.expirePlanYear))
        replacedText = replacedText.replace('__user', dynamic_text.user)
        replacedText = replacedText.replace('__open', dynamic_text.openChatHour)
        replacedText = replacedText.replace('__stop', dynamic_text.stopChatHour)
        return replacedText
    } catch (err) {
        return text
    }
}

export function sendMultiGroupMessage (groupsId: Array<{ id: string }>, text: string): void {
    for (const { id } of groupsId) {
        bot.telegram.sendMessage(id, text)
            .catch(err => err)
    }
}

export function sendGroupMessage (groupId: string, text: string): void {
    bot.telegram.sendMessage(groupId, text)
        .catch(err => err)
}

export function checkOpenedChat(openChatHour: number, stopChatHour: number): boolean {
    if (stopChatHour <= new Date().getHours() || openChatHour >= new Date().getHours()) return false
    else return true
}
