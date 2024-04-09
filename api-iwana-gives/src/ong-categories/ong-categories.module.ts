import { Module } from '@nestjs/common';
import { OngCategoriesService } from './services/ong-categories.service';
import { OngCategoriesController } from './controllers/ong-categories.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OngCategory } from './entities/ong-category.entity';
import { OngCategoryRepository } from './respositories/ong-category.repository';
import { OngCategoriesAdminController } from './controllers/ong-categories-admin.controller';
import { OngCategoriesAdminService } from './services/ong-categories-admin.service';

@Module({
    imports: [TypeOrmModule.forFeature([OngCategory])],
    controllers: [OngCategoriesController, OngCategoriesAdminController],
    providers: [OngCategoriesService, OngCategoryRepository, OngCategoriesAdminService],
    exports: [OngCategoriesService],
})
export class OngCategoriesModule {}
