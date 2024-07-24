import { ApiPropertyOptional } from "@nestjs/swagger";

export class GetUserFilterDto{
    @ApiPropertyOptional()
    login?: string;

    @ApiPropertyOptional({
        type: Number,
    })
    take?: number;

    @ApiPropertyOptional({
        type: Number,
    })
    skip ?: number;
}