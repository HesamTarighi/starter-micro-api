"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WizardScene = exports.BaseScenes = void 0;
const telegraf_1 = require("telegraf");
const bot_config_1 = require("../config/bot.config");
const enums_1 = require("../enums/enums");
const chat_1 = require("../modules/chat");
var BaseScenes;
(function (BaseScenes) {
    BaseScenes.SetOpenChatTimer = () => {
        const scene = new telegraf_1.Scenes.BaseScene('BaseScene/SetOpenChatTimer');
        scene.enter(ctx => {
            ctx.reply('لطفا ساعت باز شدن گروه را تعیین کنید');
            scene.on('text', ctx => {
                ctx.sessionDB.get('groups').__wrapped__.groups.openChatHour = ctx.message.text;
                return ctx.scene.leave();
            });
        });
        scene.leave(ctx => ctx.reply('ساعت باز شدن گروه تعیین شد'));
        return scene;
    };
    BaseScenes.SetStopChatTimer = () => {
        const scene = new telegraf_1.Scenes.BaseScene('BaseScene/SetStopChatTimer');
        scene.enter(ctx => {
            ctx.reply('لطفا ساعت بسته شدن گروه را تعیین کنید');
            scene.on('text', ctx => {
                ctx.sessionDB.get('groups').__wrapped__.groups.stopChatHour = ctx.message.text;
                return ctx.scene.leave();
            });
        });
        scene.leave(ctx => ctx.reply('ساعت بسته شدن گروه تعیین شد'));
        return scene;
    };
    BaseScenes.SetExpirePlanYear = () => {
        const scene = new telegraf_1.Scenes.BaseScene('BaseScene/SetExpirePlanYear');
        scene.enter(ctx => {
            ctx.reply('لطفا سال انقضای پشتیبانی را تعیین کنید');
            scene.on('text', ctx => {
                if (/[0-9]/.test(ctx.message.text))
                    ctx.sessionDB.__wrapped__.groups.expirePlanYear = ctx.message.text;
                else
                    ctx.sessionDB.__wrapped__.groups.expirePlanYear = 1;
                (0, chat_1.sendMultiGroupMessage)(ctx.sessionDB.__wrapped__.groups.groups, `انقضای پشتیبانی ${ctx.sessionDB.__wrapped__.groups.expirePlanYear} ساله شد.`);
                return ctx.scene.leave();
            });
        });
        scene.leave(ctx => ctx.reply(`انقضای پشتیبانی ${ctx.sessionDB.get('groups').__wrapped__.groups.expirePlanYear} ساله شد`));
        return scene;
    };
    BaseScenes.SetMemberJoinText = () => {
        const scene = new telegraf_1.Scenes.BaseScene('BaseScene/SetMemberJoinText');
        scene.enter(ctx => {
            ctx.reply('لطفا متن اماده برای ورود کاربر به گروه را وارد کنید');
            scene.on('text', ctx => {
                ctx.sessionDB.get('groups').__wrapped__.groups.memberJoinedText = ctx.message.text;
                return ctx.scene.leave();
            });
        });
        scene.leave(ctx => ctx.reply('متن تنظیم شد'));
        return scene;
    };
    BaseScenes.SetOpenChatText = () => {
        const scene = new telegraf_1.Scenes.BaseScene('BaseScene/SetOpenChatText');
        scene.enter(ctx => {
            ctx.reply('لطفا متن اماده برای باز شدن گروه را وارد کنید');
            scene.on('text', ctx => {
                ctx.sessionDB.get('groups').__wrapped__.groups.openChatText = ctx.message.text;
                return ctx.scene.leave();
            });
        });
        scene.leave(ctx => ctx.reply('متن تنظیم شد'));
        return scene;
    };
    BaseScenes.SetStopChatText = () => {
        const scene = new telegraf_1.Scenes.BaseScene('BaseScene/SetStopChatText');
        scene.enter(ctx => {
            ctx.reply('لطفا متن اماده برای بسته شدن گروه را وارد کنید');
            scene.on('text', ctx => {
                ctx.sessionDB.get('groups').__wrapped__.groups.stopChatText = ctx.message.text;
                return ctx.scene.leave();
            });
        });
        scene.leave(ctx => ctx.reply('متن تنظیم شد'));
        return scene;
    };
    BaseScenes.SetExpiredPlanText = () => {
        const scene = new telegraf_1.Scenes.BaseScene('BaseScene/setExpiredPlanText');
        scene.enter(ctx => {
            ctx.reply('لطفا متن اماده برای پایاین انقضای کاربر را وارد کنید');
            scene.on('text', ctx => {
                ctx.sessionDB.get('groups').__wrapped__.groups.expiredPlanText = ctx.message.text;
                return ctx.scene.leave();
            });
        });
        scene.leave(ctx => ctx.reply('متن تنظیم شد'));
        return scene;
    };
    BaseScenes.SetNewAdmin = () => {
        const scene = new telegraf_1.Scenes.BaseScene('BaseScene/SetNewAdmin');
        let leaveText = '';
        scene.enter(ctx => {
            ctx.reply('لطفا ایدی ادمین را وارد کنید');
            scene.on('text', ctx => {
                bot_config_1.bot.telegram.getChat(ctx.message.text)
                    .then(chat => {
                    ctx.sessionDB.get('admins').push(chat).write();
                    leaveText = 'ادمین شناخته شد';
                })
                    .catch(err => leaveText = 'ایدی اشتباه است');
                return ctx.scene.leave();
            });
        });
        scene.leave(ctx => ctx.reply('ادمین شناخته شد'));
        return scene;
    };
    BaseScenes.RemoveAdmin = () => {
        const scene = new telegraf_1.Scenes.BaseScene('BaseScene/RemoveAdmin');
        let leaveText = '';
        scene.enter(ctx => {
            ctx.reply('لطفا ایدی ادمین را وارد کنید');
            scene.on('text', ctx => {
                const adminIndex = ctx.sessionDB.__wrapped__.admins.findIndex((admin) => String(admin.id) == ctx.message.text);
                if (adminIndex != -1) {
                    ctx.sessionDB.get('admins').splice(adminIndex, 1).write();
                    leaveText = 'ادمین حذف شد';
                }
                else
                    leaveText = 'این ادمین وجود ندارد.';
                return ctx.scene.leave();
            });
        });
        scene.leave(ctx => ctx.reply(leaveText));
        return scene;
    };
    BaseScenes.SetNewGroup = () => {
        const scene = new telegraf_1.Scenes.BaseScene('BaseScene/SetNewGroup');
        scene.enter(ctx => {
            ctx.reply('لطفا ایدی گروه را وارد کنید');
            scene.on('text', ctx => {
                bot_config_1.bot.telegram.getChat(ctx.message.text)
                    .then(chat => ctx.sessionDB.get('groups').get('groups').push({ info: chat, stopChatHour: 9, openChatHour: 21, toggleChat: 'TIMER' }).write())
                    .catch(err => err);
                return ctx.scene.leave();
            });
        });
        scene.leave(ctx => ctx.reply('گروه شناخته شد'));
        return scene;
    };
    BaseScenes.RemoveGroup = () => {
        const scene = new telegraf_1.Scenes.BaseScene('BaseScene/RemoveGroup');
        scene.enter(ctx => {
            ctx.reply('لطفا ایدی گروه را وارد کنید');
            scene.on('text', ctx => {
                const groupIndex = ctx.sessionDB.__wrapped__.groups.groups.findIndex((group) => String(group.info.id) == ctx.message.text);
                if (groupIndex != -1)
                    ctx.sessionDB.get('groups').get('groups').splice(groupIndex, 1).write();
                return ctx.scene.leave();
            });
        });
        scene.leave(ctx => ctx.reply('گروه حذف شد'));
        return scene;
    };
})(BaseScenes || (exports.BaseScenes = BaseScenes = {}));
var WizardScene;
(function (WizardScene) {
    WizardScene.SetChatCondition = new telegraf_1.Scenes.WizardScene('WizardScene/SetChatCondition', ctx => {
        const groups = ctx.sessionDB.__wrapped__.groups.groups.map((group) => {
            return { text: group.info.title, callback_data: group.info.id };
        });
        ctx.reply("گروه را انتخاب کنید", {
            reply_markup: {
                inline_keyboard: [
                    groups
                ]
            }
        });
        return ctx.wizard.next();
    }, ctx => {
        ctx.reply('تغییر وضعیت گروه', {
            reply_markup: {
                inline_keyboard: [
                    [{ text: "بسته شود", callback_data: enums_1.EToggleChat.STOP }, { text: "باز شود", callback_data: enums_1.EToggleChat.OPEN }],
                    [{ text: "زمان بندی", callback_data: enums_1.EToggleChat.TIMER }]
                ]
            }
        });
        try {
            ctx.deleteMessage(ctx.callbackQuery.message.message_id);
            ctx.wizard.state.groupId = ctx.callbackQuery.data;
            return ctx.wizard.next();
        }
        catch (err) {
            ctx.scene.leave();
        }
    }, ctx => {
        const groupIndex = ctx.sessionDB.__wrapped__.groups.groups.findIndex((group) => group.info.id == ctx.wizard.state.groupId);
        const group = ctx.sessionDB.__wrapped__.groups.groups[groupIndex];
        try {
            group.toggleChat = ctx.callbackQuery.data;
            ctx.deleteMessage(ctx.callbackQuery.message.message_id);
            ctx.reply(`وضعیت گروه تنظیم شد`);
            if (ctx.callbackQuery.data == enums_1.EToggleChat.TIMER) {
                if ((0, chat_1.checkOpenedChat)(Number(group.stopChatHour), Number(group.openChatHour)))
                    (0, chat_1.sendGroupMessage)(ctx.wizard.state.groupId, ctx.sessionDB.__wrapped__.groups.openChatText);
                else
                    (0, chat_1.sendGroupMessage)(ctx.wizard.state.groupId, ctx.sessionDB.__wrapped__.groups.stopChatText);
            }
            if (ctx.callbackQuery.data == enums_1.EToggleChat.OPEN)
                (0, chat_1.sendGroupMessage)(ctx.wizard.state.groupId, 'گروه باز است');
            if (ctx.callbackQuery.data == enums_1.EToggleChat.STOP)
                (0, chat_1.sendGroupMessage)(ctx.wizard.state.groupId, 'گروه بسته است');
            ctx.scene.leave();
        }
        catch (err) {
            ctx.deleteMessage(ctx.callbackQuery.message.message_id);
            ctx.scene.leave();
        }
    });
    WizardScene.SetOpenChatTimer = new telegraf_1.Scenes.WizardScene('WizardScene/SetOpenChatTimer', (ctx) => __awaiter(this, void 0, void 0, function* () {
        const groups = ctx.sessionDB.__wrapped__.groups.groups.map((group) => {
            return { text: group.info.title, callback_data: group.info.id };
        });
        yield ctx.reply("گروه را انتخاب کنید", {
            reply_markup: {
                inline_keyboard: [
                    groups
                ]
            }
        });
        return ctx.wizard.next();
    }), ctx => {
        ctx.reply('لطفا ساعت باز شدن گروه را تعیین کنید');
        ctx.deleteMessage(ctx.callbackQuery.message.message_id);
        ctx.wizard.state.groupId = ctx.callbackQuery.data;
        return ctx.wizard.next();
    }, ctx => {
        const groupIndex = ctx.sessionDB.__wrapped__.groups.groups.findIndex((group) => group.info.id == ctx.wizard.state.groupId);
        ctx.sessionDB.get('groups').__wrapped__.groups.groups[groupIndex].openChatHour = Number(ctx.message.text);
        ctx.reply('ساعت باز شدن گروه تعیین شد');
        return ctx.scene.leave();
    });
    WizardScene.SetStopChatTimer = new telegraf_1.Scenes.WizardScene('WizardScene/SetStopChatTimer', (ctx) => __awaiter(this, void 0, void 0, function* () {
        const groups = ctx.sessionDB.__wrapped__.groups.groups.map((group) => {
            return { text: group.info.title, callback_data: group.info.id };
        });
        yield ctx.reply("گروه را انتخاب کنید", {
            reply_markup: {
                inline_keyboard: [
                    groups
                ]
            }
        });
        return ctx.wizard.next();
    }), ctx => {
        ctx.reply('لطفا ساعت بسته شدن گروه را تعیین کنید');
        ctx.deleteMessage(ctx.callbackQuery.message.message_id);
        ctx.wizard.state.groupId = ctx.callbackQuery.data;
        return ctx.wizard.next();
    }, ctx => {
        const groupIndex = ctx.sessionDB.__wrapped__.groups.groups.findIndex((group) => group.info.id == ctx.wizard.state.groupId);
        ctx.sessionDB.get('groups').__wrapped__.groups.groups[groupIndex].stopChatHour = Number(ctx.message.text);
        ctx.reply('ساعت بسته شدن گروه تعیین شد');
        return ctx.scene.leave();
    });
})(WizardScene || (exports.WizardScene = WizardScene = {}));
