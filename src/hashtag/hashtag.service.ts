/* eslint-disable prefer-const */
/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Hashtag } from './hashtag.entity';
import { CreateHashtagDto } from './dto/create-hashtag.dto';

@Injectable()
export class HashtagService {
    constructor(
        @InjectRepository(Hashtag)
        private readonly hashtagRepository: Repository<Hashtag>
    ){}

    public async createHashtag(createHashtagDto: CreateHashtagDto) {
        let hashtag = this.hashtagRepository.create(createHashtagDto);

        return await this.hashtagRepository.save(hashtag);
    }

    // Find Hashtags
    public async findHashtags(hashtags: number[] = []) {
        // Nothing to look up, and In([]) would build an empty IN () clause
        if(hashtags.length === 0) {
            return [];
        }

        return await this.hashtagRepository.find({
            where: {id: In(hashtags)}
        })
    }

    // All Hashtags 
    public async allHashTags() {
        return await this.hashtagRepository.find();
    }

    // Delete Hashtag
    public async deleteHashtag(id: number) {
        await this.hashtagRepository.delete({id: id});
        return {deleted: true, id}
    }
}
