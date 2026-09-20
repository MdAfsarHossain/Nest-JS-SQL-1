/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { TweetService } from './tweet.service';
import { CreateTweetDto } from './dto/create-tweet.dto';
import { UpdateTweetDto } from './dto/update-tweet.dto';

@Controller('tweet')
export class TweetController {
    constructor(
        private readonly tweetService: TweetService
    ){}

    @Get()
    public getAllUsersTweets() {
        return this.tweetService.getAllUsersTweets()
    }

    // My All Tweets
    @Get(':userId')
    public getMyAllTweets(@Param('userId', ParseIntPipe) userId: number) {
        return this.tweetService.getMyAllTweets(userId);
    }

    @Post()
    public createTweet(@Body() tweet: CreateTweetDto) {
        return this.tweetService.createTweet(tweet)
    }

    // Update Tweet
    @Patch()
    public updateTweet(@Body() tweet: UpdateTweetDto) {
        return this.tweetService.updateTweet(tweet);
    }

    @Delete(':id')
    public deleteTweet(@Param('id', ParseIntPipe) id: number) {
        return this.tweetService.deleteTweet(id);
    }

}
