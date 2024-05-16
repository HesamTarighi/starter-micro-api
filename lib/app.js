"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("./modules/global");
const dotenv_1 = __importDefault(require("dotenv"));
const telegraf_1 = require("telegraf");
const bot_config_1 = require("./config/bot.config");
const scene_1 = require("./scene/scene");
const telegraf_session_local_1 = __importDefault(require("telegraf-session-local"));
const panels_1 = require("./modules/panels");
const enums_1 = require("./enums/enums");
const chat_1 = require("./modules/chat");
const localSession = new telegraf_session_local_1.default({
    database: process.env.DATABASE_PATH,
    state: { groups: {}, users: [], admins: [] }
});
const stage = new telegraf_1.Scenes.Stage([
    scene_1.BaseScenes.SetOpenChatTimer(), scene_1.BaseScenes.SetStopChatTimer(), scene_1.BaseScenes.SetExpirePlanYear(), scene_1.BaseScenes.SetMemberJoinText(), scene_1.BaseScenes.SetOpenChatText(),
    scene_1.BaseScenes.SetStopChatText(), scene_1.BaseScenes.SetExpiredPlanText(), scene_1.BaseScenes.SetNewAdmin(), scene_1.BaseScenes.RemoveAdmin(), scene_1.BaseScenes.SetNewGroup(), scene_1.BaseScenes.RemoveGroup(),
    scene_1.WizardScene.SetChatCondition, scene_1.WizardScene.SetOpenChatTimer, scene_1.WizardScene.SetStopChatTimer
]);
// init usage
dotenv_1.default.config();
bot_config_1.bot.use(localSession.middleware());
bot_config_1.bot.use(stage.middleware());
// timers
setInterval(() => {
    for (const group of localSession.DB.__wrapped__.groups.groups) {
        if (group.toggleChat === enums_1.EToggleChat.TIMER) {
            // send notif during start or stop chat
            if (new Date().getHours() == Number(group.openChatHour) && new Date().getMinutes() == 0) {
                (0, chat_1.sendGroupMessage)(group.info.id, (0, chat_1.dynamicText)(localSession.DB.__wrapped__.groups.openChatText, { openChatHour: group.openChatHour }));
            }
            if (new Date().getHours() == Number(group.stopChatHour) && new Date().getMinutes() == 0) {
                (0, chat_1.sendGroupMessage)(group.info.id, (0, chat_1.dynamicText)(localSession.DB.__wrapped__.groups.stopChatText, { stopChatHour: group.stopChatHour }));
            }
            // send notif before start or stop chat
            if (new Date().getHours() + 1 == Number(group.openChatHour) && new Date().getMinutes() == 50) {
                (0, chat_1.sendGroupMessage)(group.info.id, '10 دقیقه دیگر گروه باز میشود');
            }
            if (new Date().getHours() + 1 == Number(group.stopChatHour) && new Date().getMinutes() == 50) {
                (0, chat_1.sendGroupMessage)(group.info.id, `هشدار!⚠️
                تا شروع ساعتی خاموشی ده دقیقه مانده است، پس از این تایم گروه بسته خواهد شد.`);
            }
        }
    }
}, 60000);
// manage commands
panels_1.Admin.useCommands().setChatConditionCommand();
panels_1.Admin.useCommands().setOpenChatTimeCommand();
panels_1.Admin.useCommands().setStopChatTimeCommand();
panels_1.Admin.useCommands().setExpirePlanYearCommand();
panels_1.Admin.useCommands().showChatCondition();
panels_1.Admin.useCommands().setMemberJoinTextCommand();
panels_1.Admin.useCommands().setOpenChatTextCommand();
panels_1.Admin.useCommands().setStopChatTextCommand();
panels_1.Admin.useCommands().setExpiredPlanTextCommand();
panels_1.Admin.useCommands().setNewAdmin();
panels_1.Admin.useCommands().removeAdmin();
panels_1.Admin.useCommands().showAdmins();
panels_1.Admin.useCommands().setNewGroup();
panels_1.Admin.useCommands().removeGroup();
panels_1.Admin.useCommands().showGroups();
// manage events
panels_1.User.useCommands().startCommand();
panels_1.User.useEvents().onMemberJoined();
panels_1.User.useEvents().onSendMessageToGroup();
bot_config_1.bot.launch();
