import { IsString } from "class-validator";

export class DiscountDto{
    @IsString()
    readonly name: string

    @IsString()
    readonly image: string

    @IsString()
    readonly percent: string

    @IsString()
    readonly code: string

    @IsString()
    readonly cinema: string
}