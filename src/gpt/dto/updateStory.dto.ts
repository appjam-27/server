import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString } from 'class-validator';
import { ChapterModel } from '../gpt.model';

export class UpdateStoryDTO {
  @ApiProperty({
    example: '피그마 배우기',
  })
  @IsString()
  goal: string;

  @ApiProperty({
    type: [ChapterModel],
  })
  @IsArray()
  chapters: ChapterModel[];
}

export class UpdateStoryResponseDTO {
  @ApiProperty({
    example:
      '새로운 도전 앞에 설레는 마음이 가득하다. 끊임없는 노력으로 챕터을 해결하며 지식을 쌓아가는 나 자신에게 감사하다.',
  })
  @IsString()
  content: string;
}
