/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, Req } from '@nestjs/common';
import { TweetService } from './tweet.service';
import { CreateTweetDto } from './dto/create-tweet.dto';
import { UpdateTweetDto } from './dto/update-tweet.dto';
import { PaginationQueryDto } from 'src/common/pagination/dto/pagination-query.dto';
import { GetTweetQueryDto } from './dto/get-tweet-query.dto';
import { ActiveUser } from 'src/auth/decorators/active-user.decorator';

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
    public getMyAllTweets(
        @Param('userId', ParseIntPipe) userId: number,
        @Query() paginationQueryDto: PaginationQueryDto
        // @Query() getTweetQueryDto: GetTweetQueryDto    
    ) {

        // console.log(getTweetQueryDto);
        console.log(paginationQueryDto);
        
        return this.tweetService.getMyAllTweets(userId, paginationQueryDto);
    }

    // @Post()
    // public createTweet(@Body() tweet: CreateTweetDto, @Req() request) {
    //     console.log(request.user);
        
    //     // return this.tweetService.createTweet(tweet)
    // }

    // @Post()
    // public createTweet(@Body() tweet: CreateTweetDto, @ActiveUser('email') user) {
    //     console.log(user);
        
    //     // return this.tweetService.createTweet(tweet)
    // }

    @Post()
    public createTweet(@Body() tweet: CreateTweetDto, @ActiveUser() user) {
        console.log(user);
        
        // return this.tweetService.createTweet(tweet)
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
