import { Injectable, BadRequestException, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Url } from './url.entity';
import { ShortenURLDto } from './dto/url.dto';
import { nanoid } from 'nanoid';
import { isURL } from 'class-validator';

@Injectable()
export class UrlService {
    constructor(
        @InjectRepository(Url)
        private repo: Repository<Url>
    ){}

    async shortenUrl(url: ShortenURLDto) {
        const {longUrl} = url;
        if(!isURL(longUrl)) {
            throw new BadRequestException('String must be a valid URL')
        }

        const urlCode = nanoid(10);
        const baseURL = 'http://localhost:3000';

        try {
            let url = await this.repo.findOneBy({ longUrl });
            if(url) return url.shortUrl;

            const shortUrl = `${baseURL}/${urlCode}`

            url = this.repo.create({
             longUrl,shortUrl,urlCode
            })
            
            await this.repo.save(url);
            return url.shortUrl
        } catch (err) {
            console.log(err);
            throw new UnprocessableEntityException('SERVER ERROR')
        }
    }

    async redirect(urlCode: string) {
        try {
            const url = await this.repo.findOneBy({urlCode});
            if(url) return url;

        } catch (error) {
            console.log(error)
            throw new NotFoundException('Resource Not Found')
        }
    }
}
