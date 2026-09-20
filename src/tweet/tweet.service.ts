/* eslint-disable prefer-const */
/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { Tweet } from './tweet.entity';
import { CreateTweetDto } from './dto/create-tweet.dto';
import { HashtagService } from 'src/hashtag/hashtag.service';

@Injectable()
export class TweetService {
    constructor(
        private readonly userService: UsersService,
        private readonly hashtagService: HashtagService,

        @InjectRepository(Tweet)
        private readonly tweetRepository: Repository<Tweet> 
    ){}

    public async createTweet(createTweetDto: CreateTweetDto) {
        // Find user with the given userid from user table
        // getUserById throws NotFoundException when there is no such user
        const user = await this.userService.getUserById(createTweetDto.userId);

        // Fetch all the hashtags based on hashtag array
        let hashtags = await this.hashtagService.findHashtags(createTweetDto.hashtags);

        // Create a tweet
        const tweet = this.tweetRepository.create({...createTweetDto, user: user, hashtags})

        // Save the tweet
        return await this.tweetRepository.save(tweet)
    }
}
