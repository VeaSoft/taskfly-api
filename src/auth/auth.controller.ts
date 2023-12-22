// auth.controller.ts
import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {

    constructor(private authService: AuthService){

    }

    @Get('google')
    @UseGuards(AuthGuard('google'))
    googleAuth() {
        // This route will redirect to the Google Sign-In page
    }

    @Get('google/callback')
    @UseGuards(AuthGuard('google'))
    async googleAuthRedirect(@Req() req) {
        // Handle the Google Sign-In callback
        // User data is available in req.user
        // You can generate a JWT token or session here
        const {email, firstName, lastName} = req.user;

        let userRecord = await this.authService.createUserIfNotExist(email, firstName, lastName);
        
    }
}
