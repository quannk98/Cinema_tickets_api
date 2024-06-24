import { IsArray, IsString } from "class-validator";
import mongoose from "mongoose";

export class MovieDto{
    @IsString()
    readonly name: string
    @IsString()
    readonly duration: string
    @IsArray({ each: true })
    readonly director: string
    @IsArray({each:true})
    readonly genre: string
    @IsString()
    readonly language: string
    @IsString()
    readonly subtitle: string
    @IsString()
    readonly censorship: string
    @IsArray({ each: true })
    readonly actor: string
    @IsString()
    readonly rate: string
    @IsString()
    readonly storyline: string
    @IsString()
    readonly movie_format: string
    @IsString()
    readonly release_date: string
    @IsString()
    readonly image: string
    @IsString()
    readonly trailer: string

}