import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import * as crypto from 'crypto';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(
    username: string,
    email: string,
    passwordHash: string,
  ): Promise<UserDocument> {
    const newUser = new this.userModel({ username, email, passwordHash });
    return await newUser.save();
  }

  async createWithHousehold(
    username: string,
    email: string,
    passwordHash: string,
    role: string,
    householdId: string,
  ): Promise<UserDocument> {
    const newUser = new this.userModel({
      username,
      email,
      passwordHash,
      role,
      householdId,
    });
    return await newUser.save();
  }

  async createSuperAdmin(
    email: string,
    passwordHash: string,
  ): Promise<UserDocument> {
    const newUser = new this.userModel({
      username: 'superadmin',
      email,
      passwordHash,
      role: 'SUPER_ADMIN',
    });
    return await newUser.save();
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    return await this.userModel.findOne({ email }).exec();
  }

  async findByUsername(username: string): Promise<UserDocument | null> {
    return await this.userModel.findOne({ username }).exec();
  }

  async findById(id: string): Promise<UserDocument | null> {
    return await this.userModel.findById(id).exec();
  }

  async findSuperAdmin(): Promise<UserDocument | null> {
    return await this.userModel.findOne({ role: 'SUPER_ADMIN' }).exec();
  }

  async updateRefreshToken(
    userId: string,
    refreshToken: string,
  ): Promise<void> {
    await this.userModel.findByIdAndUpdate(userId, { refreshToken }).exec();
  }

  async setPasswordResetToken(email: string): Promise<string | null> {
    const user = await this.findByEmail(email);
    if (!user) return null;

    const token = crypto.randomBytes(32).toString('hex');
    const expiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
    await this.userModel.findByIdAndUpdate(user._id, {
      passwordResetToken: token,
      passwordResetExpiry: expiry,
    }).exec();

    return token;
  }

  async resetPassword(token: string, newPasswordHash: string): Promise<boolean> {
    const now = new Date();
    const user = await this.userModel.findOne({
      passwordResetToken: token,
      passwordResetExpiry: { $gt: now },
    }).exec();

    if (!user) {
      const foundByToken = await this.userModel.findOne({ passwordResetToken: token }).exec();
      if (foundByToken) {
        this.logger.warn(`Reset failed: Token found but expired. Expiry: ${foundByToken.passwordResetExpiry}, Now: ${now}`);
      } else {
        this.logger.warn(`Reset failed: Token not found.`);
      }
      return false;
    }

    await this.userModel.findByIdAndUpdate(user._id, {
      passwordHash: newPasswordHash,
      passwordResetToken: null,
      passwordResetExpiry: null,
    }).exec();

    this.logger.log(`Password reset successful for user: ${user.email}`);
    return true;
  }
}
