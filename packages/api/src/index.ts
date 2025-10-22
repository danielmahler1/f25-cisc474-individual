import { Link } from './links/entities/link.entity';

import { CreateLinkDto } from './links/dto/create-link.dto';
import { UpdateLinkDto } from './links/dto/update-link.dto';

export const links = {
  dto: {
    CreateLinkDto,
    UpdateLinkDto,
  },
  entities: {
    Link,
  },
};

// Course DTOs
export * from './courses/dto/course.dto';
export * from './courses/dto/create-course.dto';
export * from './courses/dto/update-course.dto';
