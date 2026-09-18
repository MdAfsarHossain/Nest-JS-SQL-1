/* eslint-disable prettier/prettier */
import { Controller, Get } from '@nestjs/common';
import { ProfileService } from './profile.service';

@Controller('profile')
export class ProfileController {
    constructor(private profileService: ProfileService) {}

    @Get()
    public getAllProfiles() {
        return this.profileService.getAllProfiles()
    }

}
