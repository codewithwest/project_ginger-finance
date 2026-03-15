import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST ?? 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT ?? '587', 10),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD,
      },
    });
  }

  async sendInviteEmail(
    to: string,
    inviteLink: string,
    role: 'ADMIN' | 'MEMBER',
  ): Promise<void> {
    const roleLabel = role === 'ADMIN' ? 'Household Admin' : 'Household Member';
    try {
      await this.transporter.sendMail({
        from: process.env.MAIL_FROM ?? '"Ginger Finance" <noreply@ginger.app>',
        to,
        subject: `You've been invited to Ginger Finance as ${roleLabel}`,
        html: `
          <div style="font-family:sans-serif;max-width:520px;margin:auto;padding:32px;background:#0a0a0a;color:#e5e7eb;border-radius:12px;">
            <h2 style="color:#10b981;margin-bottom:8px;">Welcome to Ginger 🌿</h2>
            <p>You've been invited as a <strong>${roleLabel}</strong>. Click the link below to create your account:</p>
            <a href="${inviteLink}" style="display:inline-block;margin:24px 0;padding:12px 28px;background:#10b981;color:#fff;border-radius:8px;text-decoration:none;font-weight:600;">
              Accept Invite
            </a>
            <p style="color:#6b7280;font-size:13px;">This link expires in 7 days. If you weren't expecting this, you can ignore this email.</p>
          </div>
        `,
      });
    } catch (err) {
      this.logger.error(`Failed to send invite email to ${to}: ${String(err)}`);
    }
  }

  async sendPasswordResetEmail(to: string, resetLink: string): Promise<void> {
    try {
      await this.transporter.sendMail({
        from: process.env.MAIL_FROM ?? '"Ginger Finance" <noreply@ginger.app>',
        to,
        subject: 'Reset your Ginger Finance password',
        html: `
          <div style="font-family:sans-serif;max-width:520px;margin:auto;padding:32px;background:#0a0a0a;color:#e5e7eb;border-radius:12px;">
            <h2 style="color:#10b981;margin-bottom:8px;">Password Reset 🔐</h2>
            <p>We received a request to reset your password. Click the button below:</p>
            <a href="${resetLink}" style="display:inline-block;margin:24px 0;padding:12px 28px;background:#10b981;color:#fff;border-radius:8px;text-decoration:none;font-weight:600;">
              Reset Password
            </a>
            <p style="color:#6b7280;font-size:13px;">This link expires in 1 hour. If you didn't request this, you can safely ignore this email.</p>
          </div>
        `,
      });
    } catch (err) {
      this.logger.error(`Failed to send reset email to ${to}: ${String(err)}`);
    }
  }
}
