import { IsArray } from "class-validator";

export class TimeDto{
    @IsArray()
    readonly time: string
}