import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Food {
  @Prop()
  readonly name: string;
  @Prop()
  readonly price: number;
  @Prop()
  readonly image: string;
}

export const FoodSchema = SchemaFactory.createForClass(Food);
