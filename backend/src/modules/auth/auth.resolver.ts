import { Resolver, Mutation, Args, ObjectType, Field } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { User } from '../users/schemas/user.schema';

@ObjectType()
class AuthResponse {
  @Field()
  accessToken: string;

  @Field(() => User, { nullable: true })
  user?: User;
}

@ObjectType()
class BooleanResponse {
  @Field()
  success: boolean;
}

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => AuthResponse)
  async login(
    @Args('email', { type: () => String }) email: string,
    @Args('password', { type: () => String }) password: string,
  ) {
    const user = await this.authService.validateUser(email, password);
    if (!user) throw new Error('Invalid credentials');
    return this.authService.login(user);
  }

  @Mutation(() => AuthResponse)
  async registerWithInvite(
    @Args('token', { type: () => String }) token: string,
    @Args('username', { type: () => String }) username: string,
    @Args('password', { type: () => String }) password: string,
  ) {
    return this.authService.registerWithInvite(token, username, password);
  }

  @Mutation(() => BooleanResponse)
  async forgotPassword(@Args('email', { type: () => String }) email: string) {
    await this.authService.forgotPassword(email);
    return { success: true }; // always true to avoid user enumeration
  }

  @Mutation(() => BooleanResponse)
  async resetPassword(
    @Args('token', { type: () => String }) token: string,
    @Args('password', { type: () => String }) password: string,
  ) {
    const success = await this.authService.resetPassword(token, password);
    return { success };
  }
}
