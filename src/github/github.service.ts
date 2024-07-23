import { HttpException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GithubService {

    constructor(private configService: ConfigService) {}

    async findUser(login: string) {
        const url = this.configService.get<string>('github_api_url');    
        const response = await fetch(url + '/users/' + login);
        const body = await response.json();

        if(!response.ok)
        {
            throw new HttpException(body.message ?? "Error in request", response.status);
        }

        return body;
    }

    async findRepositories(login: string) {
        const url = this.configService.get<string>('github_api_url');    
        const response = await fetch(url + '/users/' + login + '/repos');
        const body = await response.json();

        if(!response.ok)
        {
            throw new HttpException(body.message ?? "Error in request", response.status);
        }

        return body;
    }

}
