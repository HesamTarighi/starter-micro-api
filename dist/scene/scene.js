"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseScenes = void 0;
const telegraf_1 = require("telegraf");
var BaseScenes;
(function (BaseScenes) {
    BaseScenes.SetStartChatTimer = () => {
        const scene = new telegraf_1.Scenes.BaseScene('BaseScene/SetStartChatTimer');
        scene.enter(ctx => {
            ctx.reply('لطفا ساعت باز شدن گروه را تایین کنید');
            scene.on('text', ctx => {
                ctx['session'].openChatHour = ctx.message.text;
                return ctx.scene.leave();
            });
        });
        scene.leave(ctx => ctx.reply('ساعت باز شدن گروه تایین شد'));
        return scene;
    };
    BaseScenes.SetEndChatTimer = () => {
        const scene = new telegraf_1.Scenes.BaseScene('BaseScene/SetEndChatTimer');
        scene.enter(ctx => {
            ctx.reply('لطفا ساعت بسته شدن گروه را تایین کنید');
            scene.on('text', ctx => {
                ctx['session'].stopChatHour = ctx.message.text;
                return ctx.scene.leave();
            });
        });
        scene.leave(ctx => ctx.reply('ساعت بسته شدن گروه تایین شد'));
        return scene;
    };
})(BaseScenes || (exports.BaseScenes = BaseScenes = {}));
