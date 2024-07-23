import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GithubService {

    constructor(private configService: ConfigService) {}

    async findOneInGithub(login: string) {
        const url = this.configService.get<string>('github_api_url');    
        const response = await fetch(url + '/users/' + login);
        return response.json();
    }  

}
