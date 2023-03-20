import { Controller, Get, Query, Body, Post } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { join } from 'path';

@Controller('email')
export class EmailController {
  constructor(private mailService: MailerService) {}

  @Get('plain-text-email')
  async plainTextEmail(@Query('toemail') toEmail: string) {
    await this.mailService.sendMail({
      to: toEmail,
      from: 'rickowijaya@gmail.com',
      subject: 'Simple Plain Text',
      text: 'This is just a NestJS Email sender demo',
    });
    return 'success';
  }

  @Post('html-email')
  async postHtmlEmail(@Body() payload) {
    await this.mailService.sendMail({
      to: payload.toEmail,
      from: 'rickowijaya@gmail.com',
      subject: 'HTML mail',
      template: 'index',
      context: {
        superHero: payload,
      },
      attachments: [
        {
          filename: 'ironMane.png',
          path: join(__dirname, 'mailTemplate', 'IronMane.jpg'),
          contentDisposition: 'attachment',
        },
      ],
    });

    return 'Success template';
  }
}
