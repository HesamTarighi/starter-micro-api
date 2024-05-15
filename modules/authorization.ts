import { IAdmin } from "../interface/session"

export function isAdmin (id: string, session: any): boolean {
    const admin = session.admins.find((admin: IAdmin) => String(admin.id) == id)

    if (admin && id == String(admin.id)) return true
    else return false
}
