export class GetRepoFilterDto
{
    name?: string;
    description?: string;
    language?: string;

    take?: number;
    skip ?: number;
}