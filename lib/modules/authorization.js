"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAdmin = void 0;
function isAdmin(id, session) {
    const admin = session.admins.find((admin) => String(admin.id) == id);
    if (admin && id == String(admin.id))
        return true;
    else
        return false;
}
exports.isAdmin = isAdmin;
