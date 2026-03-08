import { Resolver, Mutation, Args, ObjectType, Field } from '@nestjs/graphql';
import { AuthService } from './auth.service';

@ObjectType()
class AuthResponse {
  @Field()
  accessToken: string;
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
    @Args('email') email: string,
    @Args('password') password: string,
  ) {
    const user = await this.authService.validateUser(email, password);
    if (!user) throw new Error('Invalid credentials');
    return this.authService.login(user);
  }

  @Mutation(() => AuthResponse)
  async registerWithInvite(
    @Args('token') token: string,
    @Args('username') username: string,
    @Args('password') password: string,
  ) {
    return this.authService.registerWithInvite(token, username, password);
  }

  @Mutation(() => BooleanResponse)
  async forgotPassword(@Args('email') email: string) {
    await this.authService.forgotPassword(email);
    return { success: true }; // always true to avoid user enumeration
  }

  @Mutation(() => BooleanResponse)
  async resetPassword(
    @Args('token') token: string,
    @Args('password') password: string,
  ) {
    const success = await this.authService.resetPassword(token, password);
    return { success };
  }
}
