import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString } from 'class-validator';
import { ChapterModel, StoryModel } from '../gpt.model';

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
    type: StoryModel,
  })
  story: StoryModel;

  @ApiProperty({
    type: [ChapterModel],
  })
  @IsArray()
  chapters: ChapterModel[];
}
