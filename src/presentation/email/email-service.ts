import { createTransport } from "nodemailer";
import { envsPlugin } from "../../config/plugins/envs.plugin";

type SendEmailOptions = {
  to: string | string[];
  subject: string;
  htmlBody: string;
  attachments?: Attachment[]
};

type Attachment = {
  filename: string;
  path: string;
}

export class EmailService {
  private transporter = createTransport({
    service: envsPlugin.MAILER_SERVICE,
    auth: {
      user: envsPlugin.MAILER_EMAIL,
      pass: envsPlugin.MAILER_PASSWORD
    }
  });

  async sendEmailWithFSLogs(to: SendEmailOptions["to"]): Promise<void> {
    const emailOptions: SendEmailOptions  = {
      to,
      subject: "Logs del Sistema",
      htmlBody: "<h1>Enviando Logs</h1><p>test envio de logs</p>",
      attachments: [
        {
          filename: "logs-all.log",
          path: './logs/logs-all.log'
        },
        {
          filename: "logs-high.log",
          path: './logs/logs-high.log'
        },
        {
          filename: "logs-medium.log",
          path: './logs/logs-medium.log'
        },
      ]
    }
    return this.sendEmail(emailOptions);
  }

  async sendEmail({
    to,
    subject,
    htmlBody,
    attachments = []
  }: SendEmailOptions): Promise<void> {
    await this.transporter.sendMail({
      from: envsPlugin.MAILER_EMAIL,
      to,
      subject,
      html: htmlBody,
      attachments
    });
  }
}