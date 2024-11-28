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