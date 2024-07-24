import { ApiPropertyOptional } from "@nestjs/swagger";

export class GetRepoFilterDto
{
    @ApiPropertyOptional()
    name?: string;

    @ApiPropertyOptional()
    description?: string;

    @ApiPropertyOptional()
    language?: string;

    @ApiPropertyOptional({
        type: Number,
    })
    take?: number;

    @ApiPropertyOptional({
        type: Number,
    })
    skip ?: number;
}