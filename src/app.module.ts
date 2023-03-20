import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EmailController } from './email.controller';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: 'smtp.sendgrid.net',
        auth: {
          user: 'apikey',
          pass: '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',
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
