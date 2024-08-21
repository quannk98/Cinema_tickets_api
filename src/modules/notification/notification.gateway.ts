import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ESeatStatus } from 'src/common/enums/user.enum';
import { SeatReponsitory } from 'src/repositories/seat.reponsitory';

@WebSocketGateway()
export class NotificationGateway {
  constructor(private readonly seatReponsitory: SeatReponsitory) {}
  @WebSocketServer() server: Server;

  NotificationUser(data: any) {
    this.server.emit('notification', data);
  }

  StatusSeat(data: any) {
    this.server.emit('statusseat', data);
  }

  // async handleSeatStatusUpdate(
  //   client: Socket,
  //   data: { seatId: string; status: string },
  // ) {
  //   const { seatId, status } = data;

  //   try {
  //     // Xử lý logic cập nhật trạng thái ghế (ví dụ: cập nhật cơ sở dữ liệu)
  //     await this.seatReponsitory.updateSeat(seatId, {
  //       status: status,
  //     });

  //     // Gửi phản hồi xác nhận
  //     client.emit('seatStatusUpdateResponse', {
  //       seatId,
  //       status,
  //       success: true,
  //       message: 'Seat status updated successfully',
  //     });

  //     this.server.emit('seatStatusUpdate', {
  //       seatId,
  //       status,
  //     });
  //   } catch (error) {
  //     console.error('Error updating seat status:', error);
  //     client.emit('seatStatusUpdateResponse', {
  //       seatId,
  //       status,
  //       success: false,
  //       message: 'Error updating seat status',
  //     });
  //   }
  // }
}
