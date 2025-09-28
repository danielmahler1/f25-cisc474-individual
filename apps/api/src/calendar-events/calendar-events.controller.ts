import { Controller, Get, Param } from '@nestjs/common';
import { CalendarEventsService } from './calendar-events.service';

@Controller('calendar-events')
export class CalendarEventsController {
  constructor(private readonly calendarEventsService: CalendarEventsService) {}

  @Get()
  findAll() {
    return this.calendarEventsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.calendarEventsService.findOne(id);
  }
}
