"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = exports.Admin = void 0;
const bot_config_1 = require("../config/bot.config");
const enums_1 = require("../enums/enums");
const authorization_1 = require("../modules/authorization");
const chat_1 = require("../modules/chat");
var Admin;
(function (Admin) {
    Admin.useCommands = () => {
        return {
            setChatConditionCommand: () => bot_config_1.bot.command('set_chat_condition', ctx => {
                if ((0, authorization_1.isAdmin)(String(ctx.message.from.id), ctx.sessionDB.__wrapped__))
                    return ctx.scene.enter('WizardScene/SetChatCondition');
            }),
            setOpenChatTimeCommand: () => bot_config_1.bot.command('set_open_time', ctx => {
                if ((0, authorization_1.isAdmin)(String(ctx.message.from.id), ctx.sessionDB.__wrapped__))
                    return ctx.scene.enter('WizardScene/SetOpenChatTimer');
            }),
            setStopChatTimeCommand: () => bot_config_1.bot.command('set_stop_time', ctx => {
                if ((0, authorization_1.isAdmin)(String(ctx.message.from.id), ctx.sessionDB.__wrapped__))
                    return ctx.scene.enter('WizardScene/SetStopChatTimer');
            }),
            setExpirePlanYearCommand: () => bot_config_1.bot.command('set_expire_plan', ctx => {
                if ((0, authorization_1.isAdmin)(String(ctx.message.from.id), ctx.sessionDB.__wrapped__))
                    return ctx.scene.enter('BaseScene/SetExpirePlanYear');
            }),
            showChatCondition: () => bot_config_1.bot.command('show_chat_condition', ctx => {
                if ((0, authorization_1.isAdmin)(String(ctx.message.from.id), ctx.sessionDB.__wrapped__)) {
                    if (ctx.sessionDB.get('groups').__wrapped__.groups.toggleChat === enums_1.EToggleChat.OPEN)
                        ctx.reply('گروه باز است');
                    if (ctx.sessionDB.get('groups').__wrapped__.groups.toggleChat === enums_1.EToggleChat.STOP)
                        ctx.reply('گروه بسته است');
                    if (ctx.sessionDB.get('groups').__wrapped__.groups.toggleChat === enums_1.EToggleChat.TIMER)
                        ctx.reply('گروه روی حالت تایمر است');
                }
            }),
            setMemberJoinTextCommand: () => bot_config_1.bot.command('set_join_text', ctx => {
                if ((0, authorization_1.isAdmin)(String(ctx.message.from.id), ctx.sessionDB.__wrapped__))
                    return ctx.scene.enter('BaseScene/SetMemberJoinText');
            }),
            setOpenChatTextCommand: () => bot_config_1.bot.command('set_open_chat_text', ctx => {
                if ((0, authorization_1.isAdmin)(String(ctx.message.from.id), ctx.sessionDB.__wrapped__))
                    return ctx.scene.enter('BaseScene/SetOpenChatText');
            }),
            setStopChatTextCommand: () => bot_config_1.bot.command('set_stop_chat_text', ctx => {
                if ((0, authorization_1.isAdmin)(String(ctx.message.from.id), ctx.sessionDB.__wrapped__))
                    return ctx.scene.enter('BaseScene/SetStopChatText');
            }),
            setExpiredPlanTextCommand: () => bot_config_1.bot.command('set_expired_plan_text', ctx => {
                if ((0, authorization_1.isAdmin)(String(ctx.message.from.id), ctx.sessionDB.__wrapped__))
                    return ctx.scene.enter('BaseScene/SetExpiredPlanText');
            }),
            setNewAdmin: () => bot_config_1.bot.command('set_admin', ctx => {
                if ((0, authorization_1.isAdmin)(String(ctx.message.from.id), ctx.sessionDB.__wrapped__))
                    return ctx.scene.enter('BaseScene/SetNewAdmin');
            }),
            removeAdmin: () => bot_config_1.bot.command('remove_admin', ctx => {
                if ((0, authorization_1.isAdmin)(String(ctx.message.from.id), ctx.sessionDB.__wrapped__))
                    return ctx.scene.enter('BaseScene/RemoveAdmin');
            }),
            showAdmins: () => bot_config_1.bot.command('show_admins', ctx => {
                if ((0, authorization_1.isAdmin)(String(ctx.message.from.id), ctx.sessionDB.__wrapped__)) {
                    for (const admin of ctx.sessionDB.__wrapped__.admins)
                        ctx.reply(`${admin.first_name} @${admin.username}`);
                }
            }),
            setNewGroup: () => bot_config_1.bot.command('set_group', ctx => {
                if ((0, authorization_1.isAdmin)(String(ctx.message.from.id), ctx.sessionDB.__wrapped__))
                    return ctx.scene.enter('BaseScene/SetNewGroup');
            }),
            removeGroup: () => bot_config_1.bot.command('remove_group', ctx => {
                if ((0, authorization_1.isAdmin)(String(ctx.message.from.id), ctx.sessionDB.__wrapped__))
                    return ctx.scene.enter('BaseScene/RemoveGroup');
            }),
            showGroups: () => bot_config_1.bot.command('show_groups', ctx => {
                if ((0, authorization_1.isAdmin)(String(ctx.message.from.id), ctx.sessionDB.__wrapped__)) {
                    for (const group of ctx.sessionDB.__wrapped__.groups.groups)
                        ctx.reply(group.info.invite_link);
                }
            }),
        };
    };
})(Admin || (exports.Admin = Admin = {}));
var User;
(function (User) {
    User.useCommands = () => {
        return {
            startCommand: () => {
                bot_config_1.bot.command('start', ctx => {
                    if (ctx.chat.type != 'group' && ctx.chat.type != 'supergroup')
                        ctx.reply(`این ربات ویژه مدیران می باشد جهت ارتباط با دارک افیس به ربات @DarcOfficeBot پیام دهید.`);
                });
            }
        };
    };
    User.useEvents = () => {
        return {
            onMemberJoined: () => bot_config_1.bot.on('new_chat_members', ctx => {
                for (const member of ctx.message.new_chat_members) {
                    const checkDuplicateUser = ctx.sessionDB.get('groups').__wrapped__.users.find((user) => user.memberInfo.id == member.id);
                    if (!checkDuplicateUser && !member.is_bot) {
                        ctx.sessionDB.get('users').push({ memberInfo: member, expired_plan_date: (0, chat_1.expiredPlanDate)(Number(ctx.sessionDB.__wrapped__.groups.expirePlanYear)) }).write();
                        ctx.reply((0, chat_1.dynamicText)(ctx.sessionDB.__wrapped__.groups.memberJoinedText, { expirePlanYear: Number(ctx.sessionDB.__wrapped__.groups.expirePlanYear), user: member.first_name }));
                    }
                }
            }),
            onSendMessageToGroup: () => bot_config_1.bot.on('message', (ctx) => {
                const groupIndex = ctx.sessionDB.__wrapped__.groups.groups.findIndex((group) => group.info.id == ctx.chat.id);
                if (ctx.chat.type == 'group' || ctx.chat.type == 'supergroup') {
                    if (groupIndex != -1) {
                        (0, chat_1.checkChatAdmin)(ctx.chat.id, ctx.message.from.id)
                            .then(({ isAdmin }) => {
                            if (!isAdmin && ctx.message.from.first_name != 'Group') {
                                if (ctx.sessionDB.get('groups').__wrapped__.groups.groups[groupIndex].toggleChat == enums_1.EToggleChat.TIMER) {
                                    if (!(0, chat_1.checkOpenedChat)(Number(ctx.sessionDB.__wrapped__.groups.groups[groupIndex].openChatHour), Number(ctx.sessionDB.__wrapped__.groups.groups[groupIndex].stopChatHour))) {
                                        ctx.deleteMessage(ctx.message.message_id);
                                        ctx.reply('فقط ادمین های گروه میتوانند در ساعت خاموشی پیام بگذارند');
                                    }
                                }
                                if (ctx.sessionDB.get('groups').__wrapped__.groups.groups[groupIndex].toggleChat == enums_1.EToggleChat.STOP) {
                                    ctx.deleteMessage(ctx.message.message_id);
                                    ctx.reply('فقط ادمین های گروه میتوانند در ساعت خاموشی پیام بگذارند');
                                }
                            }
                        });
                    }
                    // check plan
                    if ((0, chat_1.checkUserPlan)(ctx.sessionDB.get('groups').__wrapped__.users, ctx.message.from.id).isExpired) {
                        ctx.deleteMessage(ctx.message.message_id);
                        ctx.reply((0, chat_1.dynamicText)(ctx.sessionDB.__wrapped__.groups.expiredPlanText, { user: ctx.message.from.first_name }));
                    }
                }
            })
        };
    };
})(User || (exports.User = User = {}));
