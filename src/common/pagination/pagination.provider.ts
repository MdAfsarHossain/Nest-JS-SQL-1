/* eslint-disable no-unused-labels */
/* eslint-disable prettier/prettier */
import { Inject, Injectable } from '@nestjs/common';
import { PaginationQueryDto } from './dto/pagination-query.dto';
import { FindManyOptions, FindOptionsRelations, FindOptionsWhere, ObjectLiteral, Repository } from 'typeorm';
import type { Request } from 'express';
import { REQUEST } from '@nestjs/core';
import { Paginated } from './pagination.interface';

@Injectable()
export class PaginationProvider {
    constructor(
        @Inject(REQUEST)
        private readonly request: Request
    ) {}

    public async paginateQuery<T extends ObjectLiteral>(
        paginationQueryDto: PaginationQueryDto,
        repository: Repository<T>,
        where?: FindOptionsWhere<T>,
        relations?: FindOptionsRelations<T>
    ): Promise<Paginated<T>>{
        const { page = 1, limit = 10 } = paginationQueryDto;
        const findOptions: FindManyOptions<T> = {
            skip: (page - 1) * limit,
            take: limit,
        }

        // return await repository.find({
        //     skip: (page - 1) * limit,
        //     take: limit
        // })

        if(where) {
            findOptions.where = where;
        }

        if(relations) {
            findOptions.relations = relations;
        }

        const result = await repository.find(findOptions);

        const totalItems = await repository.count();
        const totalPages = Math.ceil(totalItems / limit);

        const nextPage = page === totalPages ? page : page + 1;
        const prevPage = page === 1 ? page : page - 1;

        const baseUrl = this.request.protocol + '://' + this.request.headers.host + '/';
        const newUrl = new URL(this.request.url, baseUrl);

        logging: console.log('Base URL:', baseUrl);
        logging: console.log('New URL:', newUrl.toString());
        logging: console.log('URL:', this.request.url);

        const response: Paginated<T> = {
            data: result,
            meta: {
                itemsPerPage: limit,
                totalItems: totalItems,
                currentPage: page,
                totalPages: totalPages
            },
            links: {
                first: `${newUrl.origin}${newUrl.pathname}?page=1&limit=${limit}`,
                last: `${newUrl.origin}${newUrl.pathname}?page=${totalPages}&limit=${limit}`,
                current: `${newUrl.origin}${newUrl.pathname}?page=${page}&limit=${limit}`,
                next: `${newUrl.origin}${newUrl.pathname}?page=${nextPage}&limit=${limit}`,
                previous: `${newUrl.origin}${newUrl.pathname}?page=${prevPage}&limit=${limit}`
            }
        }

        // return result;
        return response;
    }
}
