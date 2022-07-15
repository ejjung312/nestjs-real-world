import { Injectable, Logger } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';

@Injectable()
export class CronService {
  private readonly logger = new Logger(CronService.name);

  constructor(private schedulerRegistry: SchedulerRegistry) {
    this.addCronJob();
  }

  // 크론 데코레이터 선언방식
  // @Cron('* * * * * *', { name: 'cronTask' })
  // // @Cron(CronExpression.MONDAY_TO_FRIDAY_AT_09_30AM) // 매일 오전 9시 30분에 실행
  // handleCron() {
  //   this.logger.log('Task Called');
  // }

  // // 인터벌 선언방식 - 매 3초마다 반복
  // @Interval('intervalTast', 3000)
  // handleInterval() {
  //   this.logger.log('Task Called by interval');
  // }

  // // 타임아웃 선언 방식 - 단 한번만 수행
  // @Timeout('timeoutTask', 5000)
  // handleTimeout() {
  //   this.logger.log('Task Called by Timeout');
  // }

  // 동적 태스크 스케줄링
  addCronJob() {
    const name = 'cronSample';

    const job = new CronJob(`* * * * * *`, () => {
      this.logger.warn(`run! ${name}`);
    });

    // 크론 잡 추가. 실행이 되진 않음
    this.schedulerRegistry.addCronJob(name, job);

    this.logger.warn(`job ${name} added!`);
  }
}
