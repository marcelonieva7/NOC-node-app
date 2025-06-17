import { SendEmailOptions } from '../../../src/domain/services/email.service';
import { EmailService } from '../../../src/presentation/email/email-service';
import nodemailer from "nodemailer";

const mockSendMail = jest.fn()

jest.mock("nodemailer", () => ({
  createTransport: jest.fn(() => ({
    sendMail: mockSendMail
  }))
}));


describe('email-service.ts', () => {
  const emailService = new EmailService();

  const emailOptions = {
    to: "email",
    subject: "subject",
    htmlBody: "body",
    attachments: []
  }

  const from = process.env.MAILER_EMAIL

  beforeEach(() => {
    jest.clearAllMocks();
  })
  test('should sent email', async () => {
    await emailService.sendEmail(emailOptions);
    const { htmlBody:html, ...options } = emailOptions

    expect(mockSendMail).toHaveBeenCalledTimes(1);
    expect(mockSendMail).toHaveBeenCalledWith({
      ...options,
      html,
      from
    });
  });

  test('should sent email with attachments', async () => {
    const destinations = ["email1", "email2"];
    await emailService.sendEmailWithFSLogs(destinations);
    const attachments = [
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

    const emailOptions  = {
      to: destinations,
      subject: "Logs del Sistema",
      html: "<h1>Enviando Logs</h1><p>test envio de logs</p>",
      attachments,
      from
    }

    expect(mockSendMail).toHaveBeenCalledTimes(1);
    expect(mockSendMail).toHaveBeenCalledWith(emailOptions);
  });
});
