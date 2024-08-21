import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { EUserStatus } from 'src/common/enums/user.enum';

@Schema()
export class Food {
  @Prop()
  readonly name: string;
  @Prop()
  readonly price: number;
  @Prop()
  readonly image: string;

  @Prop({ type: String, enum: EUserStatus, default: EUserStatus.INACTIVE })
  readonly status: EUserStatus;
}

export const FoodSchema = SchemaFactory.createForClass(Food);
