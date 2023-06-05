import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EmailController } from './email.controller';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    MailerModule.forRoot({
      transport: {
        host: process.env.SMTP_HOST_ALI,
        port: parseInt(process.env.SMTP_PORT_ALI),
        secure: false, //required for TSL
        auth: {
          user: process.env.SMTP_USER_ALI,
          pass: process.env.SMTP_PASS_ALI,
        },
      },
      template: {
        dir: join(__dirname, 'mailTemplate'),
        adapter: new HandlebarsAdapter(),
      },
    }),
  ],
  controllers: [AppController, EmailController],
  providers: [AppService],
})
export class AppModule {}
