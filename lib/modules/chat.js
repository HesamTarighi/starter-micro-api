"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkOpenedChat = exports.sendGroupMessage = exports.sendMultiGroupMessage = exports.dynamicText = exports.checkUserPlan = exports.checkChatAdmin = exports.expiredPlanDate = void 0;
const jalali_moment_1 = __importDefault(require("jalali-moment"));
const bot_config_1 = require("../config/bot.config");
function expiredPlanDate(expirePlanYear) {
    return `${(Number((0, jalali_moment_1.default)().locale('fa').format('YYYY')) + expirePlanYear)}/${(0, jalali_moment_1.default)().locale('fa').format('MM/DD')}`;
}
exports.expiredPlanDate = expiredPlanDate;
function checkChatAdmin(chatId, userId) {
    return new Promise(resolve => {
        bot_config_1.bot.telegram.getChatAdministrators(chatId)
            .then(admins => resolve({ isAdmin: admins.some(admin => admin.user.id == userId) }));
    });
}
exports.checkChatAdmin = checkChatAdmin;
function checkUserPlan(users, userId) {
    const getUser = users.find((user) => user.memberInfo.id == userId);
    if (getUser) {
        const getUserExpiredPlanDate = getUser.expired_plan_date.split('/').join('');
        const getNowDate = (0, jalali_moment_1.default)().locale('fa').format('YYYYMMDD');
        if (Number(getNowDate) > Number(getUserExpiredPlanDate))
            return { isExpired: true };
        else
            return { isExpired: false };
    }
    else
        return { isExpired: false };
}
exports.checkUserPlan = checkUserPlan;
function dynamicText(text, dynamic_text) {
    var replacedText = text;
    try {
        replacedText = replacedText.replace('__date', expiredPlanDate(dynamic_text.expirePlanYear));
        replacedText = replacedText.replace('__user', dynamic_text.user);
        replacedText = replacedText.replace('__open', dynamic_text.openChatHour);
        replacedText = replacedText.replace('__stop', dynamic_text.stopChatHour);
        return replacedText;
    }
    catch (err) {
        return text;
    }
}
exports.dynamicText = dynamicText;
function sendMultiGroupMessage(groupsId, text) {
    for (const { id } of groupsId) {
        bot_config_1.bot.telegram.sendMessage(id, text)
            .catch(err => err);
    }
}
exports.sendMultiGroupMessage = sendMultiGroupMessage;
function sendGroupMessage(groupId, text) {
    bot_config_1.bot.telegram.sendMessage(groupId, text)
        .catch(err => err);
}
exports.sendGroupMessage = sendGroupMessage;
function checkOpenedChat(openChatHour, stopChatHour) {
    if (stopChatHour <= new Date().getHours() || openChatHour >= new Date().getHours())
        return false;
    else
        return true;
}
exports.checkOpenedChat = checkOpenedChat;
