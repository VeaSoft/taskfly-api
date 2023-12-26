// google.strategy.ts
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback, Profile } from 'passport-google-oauth20';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor() {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: VerifyCallback,
  ): Promise<any> {
    // user is validated, generate access token also here and register user if user doesn't exist yet.
    const firstName = profile.name?.givenName || '';
    const lastName = profile.name?.familyName || '';

    const user = {
      email: profile.emails[0].value,
      name: profile.displayName,
      firstName,
      lastName,
      // ... other user data
    };


    return user;
  }
}
