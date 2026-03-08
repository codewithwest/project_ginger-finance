import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { UsersService } from './users.service';
import { MailService } from '../mail/mail.service';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';

@Injectable()
export class SeedService implements OnModuleInit {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    private readonly usersService: UsersService,
    private readonly mailService: MailService,
  ) {}

  async onModuleInit() {
    await this.seedSuperAdmin();
  }

  private async seedSuperAdmin() {
    const existing = await this.usersService.findSuperAdmin();
    if (existing) {
      this.logger.log('Super admin already exists, skipping seed.');
      return;
    }

    const email = process.env.SEED_SUPER_ADMIN_EMAIL;
    if (!email) {
      this.logger.warn(
        'SEED_SUPER_ADMIN_EMAIL not set — skipping super admin seed.',
      );
      return;
    }

    // Generate a random temporary password (user will reset via email)
    const tempPassword = crypto.randomBytes(16).toString('hex');
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(tempPassword, salt);

    await this.usersService.createSuperAdmin(email, passwordHash);
    this.logger.log(
      `Super admin created for ${email}. Sending password reset email.`,
    );

    // Immediately issue a reset token so they can set their own password
    const resetToken = await this.usersService.setPasswordResetToken(email);
    if (resetToken) {
      const appUrl = process.env.APP_URL ?? 'http://localhost:3000';
      const resetLink = `${appUrl}/reset-password/${resetToken}`;
      await this.mailService.sendPasswordResetEmail(email, resetLink);
      this.logger.log(`Password reset email sent to ${email}`);
    }
  }
}
