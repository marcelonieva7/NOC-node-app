export type SendEmailOptions = {
  to: string | string[];
  subject: string;
  htmlBody: string;
  attachments?: Attachment[];
};

export type Attachment = {
  filename: string;
  path: string;
};

export abstract class BaseEmailService {

  abstract sendEmailWithFSLogs(to: SendEmailOptions['to']): Promise<void>

  abstract sendEmail(options: SendEmailOptions): Promise<void>
  
}