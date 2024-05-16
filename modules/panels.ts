import { bot } from '../config/bot.config'
import { EToggleChat } from '../enums/enums'
import { IAdmin, IGroup } from '../interface/session'
import { isAdmin } from '../modules/authorization'
import { checkChatAdmin, checkOpenedChat, checkUserPlan, dynamicText, expiredPlanDate } from '../modules/chat'

export namespace Admin {
    export const useCommands: any = () => {
        return {
            setChatConditionCommand: () =>
            bot.command('set_chat_condition', ctx => {
                if (isAdmin(String(ctx.message.from.id), ctx.sessionDB.__wrapped__)) return ctx.scene.enter('WizardScene/SetChatCondition')
            }),
            
            setOpenChatTimeCommand: () =>
            bot.command('set_open_time', ctx => {
                if (isAdmin(String(ctx.message.from.id), ctx.sessionDB.__wrapped__)) return ctx.scene.enter('WizardScene/SetOpenChatTimer')
            }),

            setStopChatTimeCommand: () =>
            bot.command('set_stop_time', ctx => {
                if (isAdmin(String(ctx.message.from.id), ctx.sessionDB.__wrapped__)) return ctx.scene.enter('WizardScene/SetStopChatTimer')
            }),

            setExpirePlanYearCommand: () =>
            bot.command('set_expire_plan', ctx => {
                if (isAdmin(String(ctx.message.from.id), ctx.sessionDB.__wrapped__)) return ctx.scene.enter('BaseScene/SetExpirePlanYear')
            }),

            showChatCondition: () =>
            bot.command('show_chat_condition', ctx => {
                if (isAdmin(String(ctx.message.from.id), ctx.sessionDB.__wrapped__)) {
                    if (ctx.sessionDB.get('groups').__wrapped__.groups.toggleChat === EToggleChat.OPEN) ctx.reply('گروه باز است')
                    if (ctx.sessionDB.get('groups').__wrapped__.groups.toggleChat === EToggleChat.STOP) ctx.reply('گروه بسته است')
                    if (ctx.sessionDB.get('groups').__wrapped__.groups.toggleChat === EToggleChat.TIMER) ctx.reply('گروه روی حالت تایمر است')
                }
            }),

            setMemberJoinTextCommand: () =>
            bot.command('set_join_text', ctx => {
                if (isAdmin(String(ctx.message.from.id), ctx.sessionDB.__wrapped__)) return ctx.scene.enter('BaseScene/SetMemberJoinText')
            }),

            setOpenChatTextCommand: () =>
            bot.command('set_open_chat_text', ctx => {
                if (isAdmin(String(ctx.message.from.id), ctx.sessionDB.__wrapped__)) return ctx.scene.enter('BaseScene/SetOpenChatText')
            }),

            setStopChatTextCommand: () =>
            bot.command('set_stop_chat_text', ctx => {
                if (isAdmin(String(ctx.message.from.id), ctx.sessionDB.__wrapped__)) return ctx.scene.enter('BaseScene/SetStopChatText')
            }),

            setExpiredPlanTextCommand: () =>
            bot.command('set_expired_plan_text', ctx => {
                if (isAdmin(String(ctx.message.from.id), ctx.sessionDB.__wrapped__)) return ctx.scene.enter('BaseScene/SetExpiredPlanText')
            }),

            setNewAdmin: () =>
            bot.command('set_admin', ctx => {
                if (isAdmin(String(ctx.message.from.id), ctx.sessionDB.__wrapped__)) return ctx.scene.enter('BaseScene/SetNewAdmin')
            }),

            removeAdmin: () =>
            bot.command('remove_admin', ctx => {
                if (isAdmin(String(ctx.message.from.id), ctx.sessionDB.__wrapped__)) return ctx.scene.enter('BaseScene/RemoveAdmin')
            }),

            showAdmins: () =>
            bot.command('show_admins', ctx => {
                if (isAdmin(String(ctx.message.from.id), ctx.sessionDB.__wrapped__)) {
                    for (const admin of ctx.sessionDB.__wrapped__.admins) ctx.reply(`${admin.first_name} @${admin.username}`)
                }
            }),

            setNewGroup: () =>
            bot.command('set_group', ctx => {
                if (isAdmin(String(ctx.message.from.id), ctx.sessionDB.__wrapped__)) return ctx.scene.enter('BaseScene/SetNewGroup')
            }),

            removeGroup: () =>
            bot.command('remove_group', ctx => {
                if (isAdmin(String(ctx.message.from.id), ctx.sessionDB.__wrapped__)) return ctx.scene.enter('BaseScene/RemoveGroup')
            }),

            showGroups: () =>
            bot.command('show_groups', ctx => {
                if (isAdmin(String(ctx.message.from.id), ctx.sessionDB.__wrapped__)) {
                    for (const group of ctx.sessionDB.__wrapped__.groups.groups) ctx.reply(group.info.invite_link)
                }
            }),
        }
    }
}

export namespace User {
    export const useCommands: any = () => {
        return {
            startCommand: () => {
                bot.command('start', ctx => {
                    if (ctx.chat.type != 'group' && ctx.chat.type != 'supergroup') ctx.reply(`این ربات ویژه مدیران می باشد جهت ارتباط با دارک افیس به ربات @DarcOfficeBot پیام دهید.`)
                })
            }
        }
    }

    export const useEvents: any = () => {
        return {
            onMemberJoined: () =>
            bot.on('new_chat_members', ctx => {
                for (const member of ctx.message.new_chat_members) {
                    const checkDuplicateUser = ctx.sessionDB.get('groups').__wrapped__.users.find((user: any) => user.memberInfo.id == member.id)

                    if (!checkDuplicateUser && !member.is_bot) {
                        ctx.sessionDB.get('users').push({ memberInfo: member, expired_plan_date: expiredPlanDate(Number(ctx.sessionDB.__wrapped__.groups.expirePlanYear)) }).write()
                        ctx.reply(dynamicText(ctx.sessionDB.__wrapped__.groups.memberJoinedText, { expirePlanYear: Number(ctx.sessionDB.__wrapped__.groups.expirePlanYear), user:  member.first_name}))
                    }
                }
            }),

            onSendMessageToGroup: () =>
            bot.on('message', (ctx: any) => {
                const groupIndex = ctx.sessionDB.__wrapped__.groups.groups.findIndex((group: IGroup) => group.info.id == ctx.chat.id)

                if (ctx.chat.type == 'group' || ctx.chat.type == 'supergroup') {
                    if (groupIndex != -1) {
                        checkChatAdmin(ctx.chat.id, ctx.message.from.id)
                            .then(({ isAdmin }) => {
                                if (!isAdmin && ctx.message.from.first_name != 'Group') {
                                    if (ctx.sessionDB.get('groups').__wrapped__.groups.groups[groupIndex].toggleChat == EToggleChat.TIMER) {
                                        if (!checkOpenedChat(Number(ctx.sessionDB.__wrapped__.groups.groups[groupIndex].openChatHour), Number(ctx.sessionDB.__wrapped__.groups.groups[groupIndex].stopChatHour))) {
                                            ctx.deleteMessage(ctx.message.message_id)
                                            ctx.reply('فقط ادمین های گروه میتوانند در ساعت خاموشی پیام بگذارند')
                                        }
                                    }
                                    if (ctx.sessionDB.get('groups').__wrapped__.groups.groups[groupIndex].toggleChat == EToggleChat.STOP) {
                                        ctx.deleteMessage(ctx.message.message_id)
                                        ctx.reply('فقط ادمین های گروه میتوانند در ساعت خاموشی پیام بگذارند')
                                    }
                                }
                            })
                    }

                    // check plan
                    if (checkUserPlan(ctx.sessionDB.get('groups').__wrapped__.users, ctx.message.from.id).isExpired) {
                        ctx.deleteMessage(ctx.message.message_id)
                        ctx.reply(dynamicText(ctx.sessionDB.__wrapped__.groups.expiredPlanText, { user: ctx.message.from.first_name }))
                    }
                }
            })
        }
    }
}
