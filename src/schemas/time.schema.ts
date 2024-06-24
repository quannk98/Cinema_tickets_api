import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema()
export class Time{
    @Prop()
    readonly time: string
   
   
}
export const TimeSchema = SchemaFactory.createForClass(Time);