import { Module } from '@nestjs/common';

import { LinksModule } from './links/links.module';
import { AssignmentsModule } from './assignments/assignments.module';
import { CalendarEventsModule } from './calendar-events/calendar-events.module';
import { CoursesModule } from './courses/courses.module';
import { EnrollmentsModule } from './enrollments/enrollments.module';
import { SubmissionsModule } from './submissions/submissions.module';
import { UsersModule } from './users/users.module';

import { AppService } from './app.service';
import { AppController } from './app.controller';

@Module({
  imports: [
    LinksModule,
    AssignmentsModule,
    CalendarEventsModule,
    CoursesModule,
    EnrollmentsModule,
    SubmissionsModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
