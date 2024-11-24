export enum SocketEvent {
  msg = 'message',
  joinRoom = 'join_room',
  leaveRoom = 'leave_room',
  startChat = 'start_chat',
  resumeChat = 'resume_chat',
  closeChat = 'close_chat',
  error = 'error',
  chatClosed = 'chat_closed',
  info = 'info',
  markAsRead = 'mark_as_read',
  joinNotificationChannel = 'join_notification_channel',
}