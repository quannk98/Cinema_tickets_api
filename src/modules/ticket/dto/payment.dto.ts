import { IsString } from "class-validator";

export class PaymentDto{
    @IsString()
    readonly amount: number

    @IsString()
    readonly name: string
}