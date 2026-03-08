import { Injectable, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { HouseholdsService } from '../households/households.service';
import { MailService } from '../mail/mail.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly householdsService: HouseholdsService,
    private readonly mailService: MailService,
  ) {}

  async validateUser(email: string, password: string): Promise<Record<string, unknown> | null> {
    const user = await this.usersService.findByEmail(email);
    if (user && await bcrypt.compare(password, user.passwordHash)) {
      const { passwordHash: _ph, ...result } = user.toObject() as Record<string, unknown>;
      return result;
    }
    return null;
  }

  login(user: Record<string, unknown>) {
    const payload = {
      username: user['username'],
      sub: user['_id'],
      role: user['role'],
      householdId: user['householdId'] ?? null,
    };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }

  async registerWithInvite(
    token: string,
    username: string,
    password: string,
  ) {
    const invitation = await this.householdsService.getInvitationByToken(token);
    if (!invitation) {
      throw new BadRequestException('Invalid or expired invitation token');
    }

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    const user = await this.usersService.createWithHousehold(
      username,
      invitation.email,
      passwordHash,
      invitation.role,
      invitation.householdId.toString(),
    );

    await this.householdsService.addMemberToHousehold(
      invitation.householdId.toString(),
      (user._id as string).toString(),
    );

    await this.householdsService.markInvitationUsed(
      (invitation._id as string).toString(),
    );

    return this.login(user.toObject() as Record<string, unknown>);
  }

  async forgotPassword(email: string): Promise<void> {
    const resetToken = await this.usersService.setPasswordResetToken(email);
    if (!resetToken) return; // don't reveal that user doesn't exist

    const appUrl = process.env.APP_URL ?? 'http://localhost:3000';
    const resetLink = `${appUrl}/reset-password/${resetToken}`;
    await this.mailService.sendPasswordResetEmail(email, resetLink);
  }

  async resetPassword(token: string, newPassword: string): Promise<boolean> {
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(newPassword, salt);
    return this.usersService.resetPassword(token, passwordHash);
  }
}
