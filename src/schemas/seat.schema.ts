import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { ESeatStatus, EUserStatus } from 'src/common/enums/user.enum';

@Schema()
export class Seat {
  @Prop()
  readonly name: string;
  @Prop()
  readonly price: number;
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Room' })
  readonly room: string;
  @Prop({ type: String, enum: ESeatStatus, default: ESeatStatus.OPEN })
  readonly status: ESeatStatus;
}

export const SeatSchema = SchemaFactory.createForClass(Seat);
