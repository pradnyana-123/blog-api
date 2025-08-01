import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { PrismaService } from 'src/common/prisma.service';

@Injectable()
export class CategoryService {
    constructor(private prisma: PrismaService){}

    async createCategory(data: CreateCategoryDto) {
        const existingCategory = await this.prisma.category.findUnique({
            where: { categoryName: data.categoryName }
        });
        
        if(existingCategory) {
            throw new BadRequestException('Category already exists')
        }

        const category = await this.prisma.category.create({
            data: { 
                ...data
            }
        });

        return category
    }
}
