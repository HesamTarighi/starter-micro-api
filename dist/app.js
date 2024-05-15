"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const telegraf_1 = require("telegraf");
const bot_config_1 = __importDefault(require("./config/bot.config"));
const scene_1 = require("./scene/scene");
const telegraf_session_local_1 = __importDefault(require("telegraf-session-local"));
const chat_authorization_1 = require("./modules/chat_authorization");
const stage = new telegraf_1.Scenes.Stage([
    scene_1.BaseScenes.SetStartChatTimer(), scene_1.BaseScenes.SetEndChatTimer()
]);
const telegram = new telegraf_1.Telegram(process.env.BOT_TOKEN);
// init usage
dotenv_1.default.config();
bot_config_1.default.use((new telegraf_session_local_1.default({ database: process.env.DATABASE_PATH })).middleware());
bot_config_1.default.use(stage.middleware());
// manage commands
bot_config_1.default.command('start', ctx => {
    telegram.
    ;
});
bot_config_1.default.command('set_open_time', ctx => ctx.scene.enter('BaseScene/SetStartChatTimer'));
bot_config_1.default.command('set_stop_time', ctx => ctx.scene.enter('BaseScene/SetEndChatTimer'));
// manage events
bot_config_1.default.on('new_chat_members', ctx => {
    for (const member of ctx.message.new_chat_members) {
        ctx.reply(`سلام ${member.first_name} خوش آمدید, شما یک سال پشتیبانی رایگان دارید`);
    }
});
bot_config_1.default.on('message', ctx => {
    (0, chat_authorization_1.checkAdmin)(ctx.chat.id, ctx.message.from.id)
        .then(({ isAdmin }) => {
        if (!isAdmin) {
            if (Number(ctx['session'].stopChatHour) <= new Date().getHours() || Number(ctx['session'].openChatHour) >= new Date().getHours()) {
                ctx.deleteMessage(ctx.message.message_id);
                ctx.reply('فقط ادمین های گروه میتوانند در ساعت خاموشی پیام بگذارند');
            }
        }
    });
});
bot_config_1.default.launch();
