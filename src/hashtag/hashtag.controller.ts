/* eslint-disable prettier/prettier */
import { Body, Controller, Post } from '@nestjs/common';
import { HashtagService } from './hashtag.service';
import { CreateHashtagDto } from './dto/create-hashtag.dto';

@Controller('hashtag')
export class HashtagController {
    constructor(
        private readonly hashtagService: HashtagService
    ) {}

    @Post()
    public createNewHashtag(@Body() createHashtagDto: CreateHashtagDto)
    {
        return this.hashtagService.createHashtag(createHashtagDto);
    }
}
