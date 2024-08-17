import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString } from 'class-validator';

export class StoriesDTO {
  @ApiProperty({
    description: '소설 제목',
    example: '초보가 피그마 천재로 성장하는 여정',
  })
  @IsString()
  title: string;

  @ApiProperty({
    description: '소설 내용들',
    example: [
      '나는 온라인 수업을 시작했다. "피그마"라는 프로그램을 배우고 싶었다.',
      '나는 온라인 수업을 시작했다. "피그마"라는 프로그램을 배우고 싶었다.',
      '나는 온라인 수업을 시작했다. "피그마"라는 프로그램을 배우고 싶었다.',
    ],
  })
  @IsArray()
  content: string[];
}
