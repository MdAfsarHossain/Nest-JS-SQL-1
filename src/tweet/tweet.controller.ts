/* eslint-disable prettier/prettier */
import { Body, Controller, Post } from '@nestjs/common';
import { TweetService } from './tweet.service';
import { CreateTweetDto } from './dto/create-tweet.dto';

@Controller('tweet')
export class TweetController {
    constructor(
        private readonly tweetService: TweetService
    ){}

    @Post()
    public createTweet(@Body() tweet: CreateTweetDto) {
        return this.tweetService.createTweet(tweet)
    }

}
