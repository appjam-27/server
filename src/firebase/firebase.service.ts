import * as admin from 'firebase-admin';
import { TopicMessage } from 'firebase-admin/lib/messaging/messaging-api';
import { DateTime } from 'luxon';
import * as serverAccount from 'secret/firebase.json';

import { Injectable } from '@nestjs/common';

import { FCMTokenMessageModel } from './models/token-data.model';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class FirebaseService {
  constructor() {
    admin.initializeApp({
      credential: admin.credential.cert(serverAccount as admin.ServiceAccount),
    });

    // test
    this.sendEveryDay();
  }

  @Cron(CronExpression.EVERY_DAY_AT_8AM)
  async sendEveryDay() {
    this.sendNotificationByTopic({
      topic: 'all',
      title: '안녕, 캔두 왔어요.',
      body: '오늘따라 춥네요,,, 아무도 없어서 그런가요,,,?',
    });
  }

  async topicMessageGenerator({
    topic,
    title,
    body,
    data,
  }: FCMTokenMessageModel): Promise<TopicMessage> {
    const message: TopicMessage = {
      notification: {
        title,
        body,
      },
      topic,
      data: data as unknown as { [key: string]: string },
      android: {
        priority: 'high',
        ttl: 60 * 1000 * 30, // 30 minutes
        notification: {
          priority: 'high',
          sound: 'default',
          channelId: 'high_importance_channel',
        },
      },
      apns: {
        headers: {
          'apns-priority': '10',
          'apns-expiration': (60 * 30).toString(), // 30 minutes
        },
        payload: {
          aps: {
            badge: 0,
            sound: 'default',
          },
        },
      },
    };

    return message;
  }

  async sendNotificationByTopic(
    notificationData: FCMTokenMessageModel,
  ): Promise<boolean> {
    try {
      await admin
        .messaging()
        .send(await this.topicMessageGenerator(notificationData))
        .then((response) => {
          console.log(
            DateTime.now().toISO({ includeOffset: true }),
            notificationData.topic,
            notificationData.body,
            response,
          );
        });

      return true;
    } catch (error) {
      console.error('Error sending message:', error);

      return false;
    }
  }
}
