import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';

@Injectable()
export class FcmNotificationService {
  constructor() {
    // Check if the app is already initialized
    if (admin.apps.length === 0) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: 'cinematickets-37258',
          privateKey: process.env.PRIVATEKEY?.replace(/\\n/g, '\n'),
          clientEmail:
            'firebase-adminsdk-4ew14@cinematickets-37258.iam.gserviceaccount.com',
        }),
      });
    }
  }

  // Method to send notification to a specific device
  async sendNotification(
    name: string,
    token: string,
    notifiId: string,
    ticketId: string,
  ): Promise<void> {
    const message = {
      notification: {
        title: 'MD CINEMA TICKETS',
        body: `${name} Chúc mừng bạn đã đặt vé thành công!`,
      },
      token,
      data: {
        notifiId,
        ticketId,
      },
    };

    try {
      const response = await admin.messaging().send(message);
      console.log('Notification sent successfully:', response);
    } catch (error) {
      console.error('Error sending notification:', error);
      if (error.code === 'messaging/registration-token-not-registered') {
        // Handle the case where the token is invalid or not found
        console.error(
          'Device token not found. Consider refreshing the token on the client-side.',
        );
      } else {
        // Handle other types of errors
        throw new Error('Notification sending failed');
      }
    }
  }
}
