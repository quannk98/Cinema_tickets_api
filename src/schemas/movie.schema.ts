import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";

@Schema()
export class Movie{
    @Prop()
    readonly name: string
    @Prop()
    readonly duration: string
    @Prop({type:[mongoose.Schema.Types.ObjectId],ref:'Director'})
    readonly director: mongoose.Types.ObjectId[]
    @Prop({type:[mongoose.Schema.Types.ObjectId],ref:'Genre'})
    readonly genre: mongoose.Types.ObjectId[]
    @Prop()
    readonly language: string
    @Prop()
    readonly subtitle: string
    @Prop()
    readonly censorship: string
    @Prop({type:[mongoose.Schema.Types.ObjectId],ref:'Actor'})
    readonly actor: mongoose.Types.ObjectId[]
    @Prop()
    readonly rate: string
    @Prop()
    readonly storyline: string
    @Prop()
    readonly movie_format: string
    @Prop({type:Date})
    readonly release_date: Date
    @Prop()
    readonly release_status: string
    @Prop()
    readonly image: string
    @Prop()
    readonly trailer: string

}
export const MovieScheme = SchemaFactory.createForClass(Movie)