import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import {
  ENotificationStatus,
  ENotificationType,
} from 'src/common/enums/user.enum';

@Schema()
export class Notification {
  @Prop()
  readonly name: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  readonly user: mongoose.Schema.Types.ObjectId;

  @Prop({ type: Date })
  readonly date: Date;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Ticket' })
  readonly ticket: mongoose.Schema.Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Discount' })
  readonly discount: mongoose.Schema.Types.ObjectId;

  @Prop()
  readonly type: string;

  @Prop({ type: Boolean, default: true })
  readonly status: true;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
