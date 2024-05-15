import { Context, Middleware } from "telegraf"

export interface ILocalSession {
    DB: any,
    middleware: () => Middleware<Context>
}

export interface IAdmin {
    id: number
    first_name: string
    username: string
    type: string
    active_usernames: Array<string>
    bio: string
    has_private_forwards: boolean
    photo: {
      small_file_id: string
      small_file_unique_id: string
      big_file_id: string
      big_file_unique_id: string
    }
    max_reaction_count: number
    accent_color_id: number
}

export interface IGroup {
    "info": {
        id: number
        title: string
        type: string
        invite_link: string
        permissions: {
          can_send_messages: boolean
          can_send_media_messages: boolean
          can_send_audios: boolean
          can_send_documents: boolean
          can_send_photos: boolean
          can_send_videos: boolean
          can_send_video_notes: boolean
          can_send_voice_notes: boolean
          can_send_polls: boolean
          can_send_other_messages: boolean
          can_add_web_page_previews: boolean
          can_change_info: boolean
          can_invite_users: boolean
          can_pin_messages: boolean
          can_manage_topics: boolean
        }
        join_to_send_messages: boolean
        max_reaction_count: number
        accent_color_id: number
      }
    stopChatHour: number
    openChatHour: number
    toggleChat: string
}

export interface IUser {
    memberInfo: {
        id: number
        is_bot: boolean
        first_name: string
        username: string
    }
    expired_plan_date: string
}
