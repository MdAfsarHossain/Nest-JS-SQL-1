/* eslint-disable prefer-const */
/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { Tweet } from './tweet.entity';
import { CreateTweetDto } from './dto/create-tweet.dto';
import { HashtagService } from 'src/hashtag/hashtag.service';
import { UpdateTweetDto } from './dto/update-tweet.dto';

@Injectable()
export class TweetService {
    constructor(
        private readonly userService: UsersService,
        private readonly hashtagService: HashtagService,

        @InjectRepository(Tweet)
        private readonly tweetRepository: Repository<Tweet> 
    ){}

    public async getAllUsersTweets() {
        return await this.tweetRepository.find();
    }

    public async getMyAllTweets(userId: number) {

        const user = await this.userService.getUserById(userId);

        if(!user) {
            throw new NotFoundException('This user does not exist!');
        }

        return await this.tweetRepository.find({
            where: {user: {id: userId}},
            relations: {user: true, hashtags: true}
        })
    }

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

    public async updateTweet(updateTweetDto: UpdateTweetDto) {
        // Find the tweet by ID, with its hashtags so the old join rows can be replaced
        const tweet = await this.tweetRepository.findOne({
            where: {id: updateTweetDto.id},
            relations: {hashtags: true}
        });

        if(!tweet) {
            throw new NotFoundException('This tweet does not exist!');
        }

        // Only touch the properties the request actually sent
        tweet.text = updateTweetDto.text ?? tweet.text;
        tweet.image = updateTweetDto.image ?? tweet.image;

        if(updateTweetDto.hashtags) {
            tweet.hashtags = await this.hashtagService.findHashtags(updateTweetDto.hashtags);
        }

        // Save the tweet
        return await this.tweetRepository.save(tweet);

    }

    public async deleteTweet(id: number) {
        await this.tweetRepository.delete({id})

        return { deleted: true, id}
    }
}
