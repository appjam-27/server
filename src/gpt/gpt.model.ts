import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class ChapterModel {
  @ApiProperty({
    description: '챕터 제목',
    example: '레이아웃과 그리드',
  })
  @IsString()
  title: string;

  @ApiProperty({
    description: '챕터 설명',
    example: '효율적인 레이아웃과 그리드 시스템을 활용하는 방법을 익혀봅시다.',
  })
  @IsString()
  desc: string;

  @ApiProperty({
    description: '챕터 소요 시간',
    example: '1시간',
  })
  @IsString()
  duration: string;
}

export class StoryModel {
  @ApiProperty({
    description: '목표 소설 제목',
    example: '초보가 피그마 천재로 성장하는 여정',
  })
  @IsString()
  title: string;

  @ApiProperty({
    description: '목표 소설 내용',
    example:
      '나는 온라인 수업을 시작했다. "피그마"라는 프로그램을 배우고 싶었다.',
  })
  @IsString()
  content: string;
}
