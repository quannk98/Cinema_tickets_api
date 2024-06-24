import { IsArray, IsString } from "class-validator";

export class TicketDto{
    @IsArray()
    readonly discount: string

    @IsArray({each:true})
    readonly seat: string
    
    @IsString()
    readonly user: string

    @IsArray()
    readonly food:string

    @IsString()
    readonly showdate: string

    @IsString()
    readonly showtime: string
    
    @IsString()
    readonly total: string

}