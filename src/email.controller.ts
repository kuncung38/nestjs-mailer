import { Controller, Get, Query, Body, Post } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { join } from 'path';
// const sgMail = require('@sendgrid/mail')
import { ConfigService } from '@nestjs/config';
import * as sgMail from '@sendgrid/mail';
import { ServerClient } from 'postmark';

import * as fs from 'fs';
import * as handlebars from 'handlebars';

@Controller('email')
export class EmailController {
  private readonly client: ServerClient;
  private readonly compiledTemplate: HandlebarsTemplateDelegate<any>;
  constructor(
    private mailService: MailerService,
    private readonly configService: ConfigService,
  ) {
    sgMail.setApiKey(this.configService.get<string>('SENDGRID_API_KEY'));
    this.client = new ServerClient(
      this.configService.get<string>('POSTMARK_API'),
    );
    // this.templateFile = fs.readFileSync(
    //   join(__dirname, 'mailTemplate', 'test.hbs'),
    //   'utf-8',
    // );
    this.compiledTemplate = handlebars.compile(
      fs.readFileSync(join(__dirname, 'mailTemplate', 'test.hbs'), 'utf-8'),
    );
  }

  @Post('test/sendgrid')
  async test() {
    const name = 'kuncung 4';

    const mail = {
      subject: 'Greeting Message from NestJS Sendgrid',
      to: 'rickowijaya@gmail.com',
      from: 'rickowijaya@gmail.com',
      text: 'Hello World from NestJS Sendgrid',
      html: this.compiledTemplate({ name }),
      // template_id: 'd-ac95ce4fe37141de9ca49307c197df05',
      // personalizations: [
      //   {
      //     to: 'rickowijaya@gmail.com',
      //     dynamic_template_data: {
      //       name: 'gundul',
      //     },
      //   },
      // ],
    };
    try {
      const response = await sgMail.send(mail);
      console.log(response);
      return 'Email sent';
    } catch (error) {
      throw error;
    }
  }

  @Post('test/postmark')
  async testPostMark() {
    const mail = {
      From: 'rickowijaya@jiwagroup.com',
      To: 'rickowijaya@jiwagroup.com',
      Subject: 'Hello from Postmark',
      HtmlBody: '<strong>Hello</strong> dear Postmark user.',
      TextBody: 'Hello from Postmark!',
      MessageStream: 'broadcast',
    };

    try {
      const response = await this.client.sendEmail(mail);
      console.log(response);
      return 'postmark success';
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  @Post('test/ali')
  async testAli() {
    try {
      await this.mailService.sendMail({
        to: 'danielpanjaitan@jiwagroup.com',
        from: `test<${process.env.SMTP_USER_ALI}>`,
        subject: 'Testing purpose',
        template: 'test',
        context: {
          name: 'Bang David',
          email: 'danielpanjaitan@jiwagroup.com',
          powered: 'Ali Cloud',
        },
      });
      return 'success';
    } catch (error) {
      throw error;
    }
  }

  // @Get('plain-text-email')
  // async plainTextEmail(@Query('toemail') toEmail: string) {
  //   await this.mailService.sendMail({
  //     to: toEmail,
  //     from: 'rickowijaya@gmail.com',
  //     subject: 'Simple Plain Text',
  //     text: 'This is just a NestJS Email sender demo',
  //   });
  //   return 'success';
  // }

  // @Post('html-email')
  // async postHtmlEmail(@Body() payload) {
  //   await this.mailService.sendMail({
  //     to: payload.toEmail,
  //     from: 'rickowijaya@gmail.com',
  //     subject: 'HTML mail',
  //     template: 'index',
  //     context: {
  //       superHero: payload,
  //     },
  //     attachments: [
  //       {
  //         filename: 'ironMane.png',
  //         path: join(__dirname, 'mailTemplate', 'IronMane.jpg'),
  //         contentDisposition: 'attachment',
  //       },
  //     ],
  //   });

  //   return 'Success template';
  // }
}
