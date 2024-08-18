import { Module } from '@nestjs/common';

import { FirebaseService } from './firebase.service';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [ScheduleModule.forRoot()],
  providers: [FirebaseService],
  exports: [FirebaseService],
})
export class FirebaseModule {}
