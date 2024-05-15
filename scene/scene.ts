import { Scenes } from "telegraf"
import { bot } from "../config/bot.config"
import { EToggleChat } from "../enums/enums"
import { IAdmin, IGroup } from "../interface/session"
import { checkOpenedChat, sendGroupMessage, sendMultiGroupMessage } from "../modules/chat"

export namespace BaseScenes {
    export const SetOpenChatTimer: any = () => {
        const scene = new Scenes.BaseScene<any>('BaseScene/SetOpenChatTimer')

        scene.enter(ctx => {
            ctx.reply('لطفا ساعت باز شدن گروه را تعیین کنید')

            scene.on('text', ctx => {
                ctx.sessionDB.get('groups').__wrapped__.groups.openChatHour = ctx.message.text
                return ctx.scene.leave()
            })
        })
        scene.leave(ctx => ctx.reply('ساعت باز شدن گروه تعیین شد'))

        return scene
    }

    export const SetStopChatTimer: any = () => {
        const scene = new Scenes.BaseScene<any>('BaseScene/SetStopChatTimer')

        scene.enter(ctx => {
            ctx.reply('لطفا ساعت بسته شدن گروه را تعیین کنید')

            scene.on('text', ctx => {
                ctx.sessionDB.get('groups').__wrapped__.groups.stopChatHour = ctx.message.text
                return ctx.scene.leave()
            })
        })
        scene.leave(ctx => ctx.reply('ساعت بسته شدن گروه تعیین شد'))

        return scene
    }

    export const SetExpirePlanYear: any = () => {
        const scene = new Scenes.BaseScene<any>('BaseScene/SetExpirePlanYear')

        scene.enter(ctx => {
            ctx.reply('لطفا سال انقضای پشتیبانی را تعیین کنید')
            scene.on('text', ctx => {
                if (/[0-9]/.test(ctx.message.text)) ctx.sessionDB.__wrapped__.groups.expirePlanYear = ctx.message.text
                else ctx.sessionDB.__wrapped__.groups.expirePlanYear = 1
                sendMultiGroupMessage(ctx.sessionDB.__wrapped__.groups.groups, `انقضای پشتیبانی ${ctx.sessionDB.__wrapped__.groups.expirePlanYear} ساله شد.`)
                return ctx.scene.leave()
            })
        })
        scene.leave(ctx => ctx.reply(`انقضای پشتیبانی ${ctx.sessionDB.get('groups').__wrapped__.groups.expirePlanYear} ساله شد`))

        return scene
    }

    export const SetMemberJoinText: any = () => {
        const scene = new Scenes.BaseScene<any>('BaseScene/SetMemberJoinText')

        scene.enter(ctx => {
            ctx.reply('لطفا متن اماده برای ورود کاربر به گروه را وارد کنید')
            scene.on('text', ctx => {
                ctx.sessionDB.get('groups').__wrapped__.groups.memberJoinedText = ctx.message.text
                return ctx.scene.leave()
            })
        })
        scene.leave(ctx => ctx.reply('متن تنظیم شد'))

        return scene
    }

    export const SetOpenChatText: any = () => {
        const scene = new Scenes.BaseScene<any>('BaseScene/SetOpenChatText')

        scene.enter(ctx => {
            ctx.reply('لطفا متن اماده برای باز شدن گروه را وارد کنید')
            scene.on('text', ctx => {
                ctx.sessionDB.get('groups').__wrapped__.groups.openChatText = ctx.message.text
                return ctx.scene.leave()
            })
        })
        scene.leave(ctx => ctx.reply('متن تنظیم شد'))

        return scene
    }

    export const SetStopChatText: any = () => {
        const scene = new Scenes.BaseScene<any>('BaseScene/SetStopChatText')

        scene.enter(ctx => {
            ctx.reply('لطفا متن اماده برای بسته شدن گروه را وارد کنید')
            scene.on('text', ctx => {
                ctx.sessionDB.get('groups').__wrapped__.groups.stopChatText = ctx.message.text
                return ctx.scene.leave()
            })
        })
        scene.leave(ctx => ctx.reply('متن تنظیم شد'))

        return scene
    }

    export const SetExpiredPlanText: any = () => {
        const scene = new Scenes.BaseScene<any>('BaseScene/setExpiredPlanText')

        scene.enter(ctx => {
            ctx.reply('لطفا متن اماده برای پایاین انقضای کاربر را وارد کنید')
            scene.on('text', ctx => {
                ctx.sessionDB.get('groups').__wrapped__.groups.expiredPlanText = ctx.message.text
                return ctx.scene.leave()
            })
        })
        scene.leave(ctx => ctx.reply('متن تنظیم شد'))

        return scene
    }

    export const SetNewAdmin: any = () => {
        const scene = new Scenes.BaseScene<any>('BaseScene/SetNewAdmin')
        let leaveText = ''
        
        scene.enter(ctx => {
            ctx.reply('لطفا ایدی ادمین را وارد کنید')
            scene.on('text', ctx => {
                bot.telegram.getChat(ctx.message.text)
                    .then(chat => {
                        ctx.sessionDB.get('admins').push(chat).write()
                        leaveText = 'ادمین شناخته شد'
                    })
                    .catch(err => leaveText = 'ایدی اشتباه است')

                return ctx.scene.leave()
            })
        })
        scene.leave(ctx => ctx.reply('ادمین شناخته شد'))

        return scene
    }

    export const RemoveAdmin: any = () => {
        const scene = new Scenes.BaseScene<any>('BaseScene/RemoveAdmin')
        let leaveText = ''

        scene.enter(ctx => {
            ctx.reply('لطفا ایدی ادمین را وارد کنید')
            scene.on('text', ctx => {
                const adminIndex = ctx.sessionDB.__wrapped__.admins.findIndex((admin: IAdmin) => admin.id == ctx.message.text)

                if (adminIndex != -1) {
                    ctx.sessionDB.get('admins').splice(adminIndex, 1).write()
                    leaveText = 'ادمین حذف شد'
                } else leaveText = 'این ادمین وجود ندارد.'

                return ctx.scene.leave()
            })
        })
        scene.leave(ctx => ctx.reply(leaveText))

        return scene
    }

    export const SetNewGroup: any = () => {
        const scene = new Scenes.BaseScene<any>('BaseScene/SetNewGroup')

        scene.enter(ctx => {
            ctx.reply('لطفا ایدی گروه را وارد کنید')
            scene.on('text', ctx => {
                bot.telegram.getChat(ctx.message.text)
                    .then(chat => ctx.sessionDB.get('groups').get('groups').push({ info: chat, stopChatHour: 9, openChatHour: 21, toggleChat: 'TIMER' }).write())
                    .catch(err => err)

                return ctx.scene.leave()
            })
        })
        scene.leave(ctx => ctx.reply('گروه شناخته شد'))

        return scene
    }

    export const RemoveGroup: any = () => {
        const scene = new Scenes.BaseScene<any>('BaseScene/RemoveGroup')

        scene.enter(ctx => {
            ctx.reply('لطفا ایدی گروه را وارد کنید')
            scene.on('text', ctx => {
                const groupIndex = ctx.sessionDB.__wrapped__.groups.groups.findIndex((group: IGroup) => group.id == ctx.message.text)

                if (groupIndex != -1) ctx.sessionDB.get('groups').get('groups').splice(groupIndex, 1).write()

                return ctx.scene.leave()
            })
        })
        scene.leave(ctx => ctx.reply('گروه حذف شد'))

        return scene
    }
}

export namespace WizardScene {
    export const SetChatCondition = new Scenes.WizardScene<any>('WizardScene/SetChatCondition',
        ctx => {
            const groups = ctx.sessionDB.__wrapped__.groups.groups.map((group: IGroup) => {
                return { text: group.info.title, callback_data: group.info.id }
            })

            ctx.reply(
                "گروه را انتخاب کنید",
                {
                    reply_markup: {
                        inline_keyboard: [
                            groups
                        ]
                    }
                }
            )
            
            return ctx.wizard.next()
        },
        ctx => {
            ctx.reply(
                'تغییر وضعیت گروه',
                {
                    reply_markup: {
                        inline_keyboard: [
                            [ { text: "بسته شود", callback_data: EToggleChat.STOP }, { text: "باز شود", callback_data: EToggleChat.OPEN }],
                            [ { text: "زمان بندی", callback_data: EToggleChat.TIMER } ]
                        ]
                    }
                }
            )
            try {
                ctx.deleteMessage(ctx.callbackQuery.message.message_id)
    
                ctx.wizard.state.groupId = ctx.callbackQuery.data
    
                return ctx.wizard.next()
            } catch (err) {
                ctx.scene.leave()
            }
        },
        ctx => {
            const groupIndex = ctx.sessionDB.__wrapped__.groups.groups.findIndex((group: IGroup) => group.info.id == ctx.wizard.state.groupId)
            const group = ctx.sessionDB.__wrapped__.groups.groups[groupIndex]

            try {
                group.toggleChat = ctx.callbackQuery.data
                ctx.deleteMessage(ctx.callbackQuery.message.message_id)
                ctx.reply(`وضعیت گروه تنظیم شد`)
                if (ctx.callbackQuery.data == EToggleChat.TIMER) {
                    if (checkOpenedChat(Number(group.stopChatHour), Number(group.openChatHour))) sendGroupMessage(ctx.wizard.state.groupId, ctx.sessionDB.__wrapped__.groups.openChatText)
                    else sendGroupMessage(ctx.wizard.state.groupId, ctx.sessionDB.__wrapped__.groups.stopChatText)
                }
                if (ctx.callbackQuery.data == EToggleChat.OPEN) sendGroupMessage(ctx.wizard.state.groupId, 'گروه باز است')
                if (ctx.callbackQuery.data == EToggleChat.STOP) sendGroupMessage(ctx.wizard.state.groupId, 'گروه بسته است')
                ctx.scene.leave()
            } catch (err) {
                ctx.deleteMessage(ctx.callbackQuery.message.message_id)
                ctx.scene.leave()
            }
        }
    )

    export const SetOpenChatTimer = new Scenes.WizardScene<any>('WizardScene/SetOpenChatTimer',
        async ctx => {
            const groups = ctx.sessionDB.__wrapped__.groups.groups.map((group: IGroup) => {
                return { text: group.info.title, callback_data: group.info.id }
            })

            await ctx.reply(
                "گروه را انتخاب کنید",
                {
                    reply_markup: {
                        inline_keyboard: [
                            groups
                        ]
                    }
                }
            )
            
            return ctx.wizard.next()
        },
        ctx => {
            ctx.reply('لطفا ساعت باز شدن گروه را تعیین کنید')
            ctx.deleteMessage(ctx.callbackQuery.message.message_id)

            ctx.wizard.state.groupId = ctx.callbackQuery.data
            return ctx.wizard.next()
        },
        ctx => {
            const groupIndex = ctx.sessionDB.__wrapped__.groups.groups.findIndex((group: IGroup) => group.info.id == ctx.wizard.state.groupId)

            ctx.sessionDB.get('groups').__wrapped__.groups.groups[groupIndex].openChatHour = Number(ctx.message.text)
            
            ctx.reply('ساعت باز شدن گروه تعیین شد')
            return ctx.scene.leave()
        }
    )

    export const SetStopChatTimer = new Scenes.WizardScene<any>('WizardScene/SetStopChatTimer',
        async ctx => {
            const groups = ctx.sessionDB.__wrapped__.groups.groups.map((group: IGroup) => {
                return { text: group.info.title, callback_data: group.info.id }
            })

            await ctx.reply(
                "گروه را انتخاب کنید",
                {
                    reply_markup: {
                        inline_keyboard: [
                            groups
                        ]
                    }
                }
            )
            
            return ctx.wizard.next()
        },
        ctx => {
            ctx.reply('لطفا ساعت بسته شدن گروه را تعیین کنید')
            ctx.deleteMessage(ctx.callbackQuery.message.message_id)

            ctx.wizard.state.groupId = ctx.callbackQuery.data
            return ctx.wizard.next()
        },
        ctx => {
            const groupIndex = ctx.sessionDB.__wrapped__.groups.groups.findIndex((group: IGroup) => group.info.id == ctx.wizard.state.groupId)

            ctx.sessionDB.get('groups').__wrapped__.groups.groups[groupIndex].stopChatHour = Number(ctx.message.text)
            
            ctx.reply('ساعت بسته شدن گروه تعیین شد')
            return ctx.scene.leave()
        }
    )
}
