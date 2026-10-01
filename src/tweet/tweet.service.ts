/* eslint-disable prefer-const */
/* eslint-disable prettier/prettier */
import { BadRequestException, ConflictException, Injectable, NotFoundException, RequestTimeoutException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { Tweet } from './tweet.entity';
import { CreateTweetDto } from './dto/create-tweet.dto';
import { HashtagService } from 'src/hashtag/hashtag.service';
import { UpdateTweetDto } from './dto/update-tweet.dto';
import { PaginationQueryDto } from 'src/common/pagination/dto/pagination-query.dto';
import { PaginationProvider } from 'src/common/pagination/pagination.provider';
import { Paginated } from 'src/common/pagination/pagination.interface';
import { ActiveUserType } from 'src/auth/interfaces/active-user-type.interface';
import { User } from 'src/users/user.entity';
import { Hashtag } from 'src/hashtag/hashtag.entity';

@Injectable()
export class TweetService {
    constructor(
        private readonly userService: UsersService,
        private readonly hashtagService: HashtagService,

        @InjectRepository(Tweet)
        private readonly tweetRepository: Repository<Tweet>,

        private readonly paginationProvider: PaginationProvider
    ){}

    public async getAllUsersTweets() {
        return await this.tweetRepository.find();
    }

    public async getMyAllTweets(userId: number, paginationQueryDto: PaginationQueryDto): Promise<Paginated<Tweet>> {

        const user = await this.userService.getUserById(userId);

        if(!user) {
            throw new NotFoundException('This user does not exist!');
        }

        // return await this.tweetRepository.find({
        //     where: {user: {id: userId}},
        //     relations: {user: true, hashtags: true}
        // })

        // WITH PAGINATION
        // const {limit = 10, page = 1} = paginationQueryDto;
        // return await this.tweetRepository.find({
        //     where: {user: {id: userId}},
        //     // relations: {user: true, hashtags: true},
        //     skip: (page - 1) * limit,
        //     take: limit
        // })

        // PAGINATION QUERY PROVIDER
        return await this.paginationProvider.paginateQuery(
            paginationQueryDto,
            this.tweetRepository,
            {user: {id: userId}}
        )
    }

    // public async createTweet(createTweetDto: CreateTweetDto, user: ActiveUserType) {
    //     // Find user with the given userid from user table
    //     // getUserById throws NotFoundException when there is no such user
    //     // const user = await this.userService.getUserById(createTweetDto.userId);

    //     const userData = await this.userService.getUserById(user.sub);

    //     // Fetch all the hashtags based on hashtag array
    //     let hashtags = await this.hashtagService.findHashtags(createTweetDto.hashtags);

    //     // Create a tweet
    //     const tweet = this.tweetRepository.create({...createTweetDto, user: userData, hashtags})

    //     // Save the tweet 
    //     return await this.tweetRepository.save(tweet)
    // }


    
    public async createTweet(createTweetDto: CreateTweetDto, userData: ActiveUserType) {
        let user: User | undefined = undefined;
        let hashtags: Hashtag[] | undefined = undefined;

        try {
            // Find user with the given userid from user table
            user = await this.userService.getUserById(userData.sub);

            
            // Fetch all the hashtags based on hashtag array
            if(createTweetDto.hashtags) {
                hashtags = await this.hashtagService.findHashtags(createTweetDto.hashtags);
            }
        } catch (error) {
            throw new RequestTimeoutException();
        }
        
        if(createTweetDto.hashtags?.length !== hashtags?.length ) {
            // throw new NotFoundException('No hashtags found for the given IDs!');
            throw new BadRequestException('No hashtags found for the given IDs!');
        }

        // Create a tweet
        const tweet = this.tweetRepository.create({...createTweetDto, user: user, hashtags})

        try {
            // Save the tweet 
            return await this.tweetRepository.save(tweet)

        } catch (error) {
            throw new ConflictException(error);
        }
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
