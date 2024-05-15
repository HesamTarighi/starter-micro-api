"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkAdmin = void 0;
const telegraf_1 = require("telegraf");
const telegram = new telegraf_1.Telegram(process.env.BOT_TOKEN);
function checkAdmin(chatId, userId) {
    return new Promise(resolve => {
        telegram.getChatAdministrators(chatId)
            .then(admins => {
            resolve({ isAdmin: admins.some(admin => admin.user.id == userId) });
        });
    });
}
exports.checkAdmin = checkAdmin;
