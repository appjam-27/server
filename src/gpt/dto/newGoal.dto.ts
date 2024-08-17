import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString } from 'class-validator';
import { ChapterModel } from '../gpt.model';
import { StoriesDTO } from './stories.dto';

export class NewGoalDTO {
  @ApiProperty({
    example: '피그마 배우기',
  })
  @IsString()
  goal: string;
}

export class NewGoalResponseDTO {
  @ApiProperty({
    example: '피그마 배우기',
  })
  @IsString()
  goal: string;

  @ApiProperty({
    example: 'design',
  })
  @IsString()
  icon: string;

  @ApiProperty({
    type: StoriesDTO,
  })
  story: StoriesDTO;

  @ApiProperty({
    type: [ChapterModel],
  })
  @IsArray()
  chapters: ChapterModel[];
}
