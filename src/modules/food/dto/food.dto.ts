import { IsString } from 'class-validator';

export class FoodDto {
  @IsString()
  readonly name: string;

  @IsString()
  readonly price: number;
  
  @IsString()
  readonly image: string;
}
