import { Injectable } from '@nestjs/common';
import { PaginationQueryDto } from './dto/pagination-query.dto';
import { FindManyOptions, FindOptionsWhere, ObjectLiteral, Repository } from 'typeorm';

@Injectable()
export class PaginationProvider {
    public async paginateQuery<T extends ObjectLiteral>(
        paginationQueryDto: PaginationQueryDto,
        repository: Repository<T>,
        where?: FindOptionsWhere<T>
    ){
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

        const result = await repository.find(findOptions);

        const totalItems = await repository.count();
        const totalPages = Math.ceil(totalItems / limit);

        const nextPage = page === totalPages ? page : page + 1;
        const prevPage = page === 1 ? page : page - 1;

        const response = {
            data: result,
            meta: {
                itemsPerPage: limit,
                totalItems: totalItems,
                currentPage: page,
                totalPages: totalPages
            },
            links: {

            }
        }

        return result;
    }
}
