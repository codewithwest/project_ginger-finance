import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Household, HouseholdDocument } from './schemas/household.schema';
import { Invitation, InvitationDocument } from './schemas/invitation.schema';
import { MailService } from '../mail/mail.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class HouseholdsService {
  constructor(
    @InjectModel(Household.name) private householdModel: Model<HouseholdDocument>,
    @InjectModel(Invitation.name) private invitationModel: Model<InvitationDocument>,
    private readonly mailService: MailService,
  ) {}

  async createHouseholdAndAdminInvite(
    name: string,
    adminEmail: string,
  ): Promise<InvitationDocument> {
    const household = new this.householdModel({ name, members: [] });
    await household.save();

    const token = uuidv4();
    const invitation = new this.invitationModel({
      householdId: household._id,
      email: adminEmail,
      token,
      role: 'ADMIN',
      status: 'pending',
    });

    await invitation.save();

    const appUrl = process.env.APP_URL ?? 'http://localhost:3000';
    const inviteLink = `${appUrl}/invite/${token}`;
    await this.mailService.sendInviteEmail(adminEmail, inviteLink, 'ADMIN');

    return invitation;
  }

  async inviteMember(
    householdId: string,
    email: string,
  ): Promise<InvitationDocument> {
    const token = uuidv4();
    const invitation = new this.invitationModel({
      householdId: new Types.ObjectId(householdId),
      email,
      token,
      role: 'MEMBER',
      status: 'pending',
    });

    await invitation.save();

    const appUrl = process.env.APP_URL ?? 'http://localhost:3000';
    const inviteLink = `${appUrl}/invite/${token}`;
    await this.mailService.sendInviteEmail(email, inviteLink, 'MEMBER');

    return invitation;
  }

  async getInvitationByToken(token: string): Promise<InvitationDocument | null> {
    return await this.invitationModel
      .findOne({ token, status: 'pending' })
      .exec();
  }

  async markInvitationUsed(id: string): Promise<void> {
    await this.invitationModel.findByIdAndUpdate(id, { status: 'used' }).exec();
  }

  async addMemberToHousehold(householdId: string, userId: string): Promise<void> {
    await this.householdModel
      .findByIdAndUpdate(householdId, {
        $push: { members: new Types.ObjectId(userId) },
      })
      .exec();
  }

  async getMyHousehold(householdId: string): Promise<HouseholdDocument | null> {
    return await this.householdModel
      .findById(householdId)
      .populate('members')
      .exec();
  }
}
