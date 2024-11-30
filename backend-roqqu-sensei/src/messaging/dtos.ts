export interface MessageDto {
  chatId: string;
  content: string;
  isAutomated: boolean;
  labelText: string;
  senderEmail?: string; // should be null if isAutomated == true
  timestamp: Date;
  attachmentPath?: string;
  attachmentType?: string;
}

export enum ChatStatus {
  open = 'OPEN',
  suspended = 'SUSPENDED',
}

export interface ChatDto {
  id: string;
  chatRoom: string;
  customerEmail: string;
  status: ChatStatus;
  createdAt?: Date;
  country?: string;
  countryCode?: string;
  messages?: any[]
}