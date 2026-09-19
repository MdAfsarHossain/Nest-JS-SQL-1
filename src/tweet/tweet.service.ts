/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { Tweet } from './tweet.entity';
import { CreateTweetDto } from './dto/create-tweet.dto';

@Injectable()
export class TweetService {
    constructor(
        private readonly userService: UsersService,

        @InjectRepository(Tweet)
        private readonly tweetRepository: Repository<Tweet> 
    ){}

    public async createTweet(createTweetDto: CreateTweetDto) {
        // Find user with the given userid from user table
        // getUserById throws NotFoundException when there is no such user
        const user = await this.userService.getUserById(createTweetDto.userId);

        // Create a tweet
        const tweet = this.tweetRepository.create({...createTweetDto, user: user})

        // Save the tweet
        return await this.tweetRepository.save(tweet)
    }
}
