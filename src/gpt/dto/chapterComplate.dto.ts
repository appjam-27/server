import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString } from 'class-validator';

export class ChapterComplateDTO {
  @ApiProperty({
    example: '피그마 배우기',
  })
  @IsString()
  goal: string;

  @ApiProperty({
    description: '챕터 내용 (마크다운 내용)',
    example:
      '# 레이아웃과 그리드\n\n레이아웃과 그리드는 웹 디자인 및 인터페이스 디자인에서 중요한 개념입니다. 효율적인 레이아웃과 그리드 시스템을 활용하여 디자인의 일관성과 조화를 유지할 수 있습니다.\n\n## 그리드 시스템의 중요성\n그리드 시스템은 요소들을 정렬하고 배치하는 기준이 되어 디자인의 일관성을 유지하는 역할을 합니다. 그리드를 활용하면 사용자가 콘텐츠를 쉽게 파악할 수 있도록 도와줍니다.\n\n## 레이아웃 설계 원칙\n- **조화와 균형**: 레이아웃을 구성할 때 요소들 사이의 조화와 균형을 고려해야 합니다.\n- **비율과 간격**: 각 요소의 비율과 간격을 일정하게 유지하여 일관성 있는 디자인을 만듭니다.\n- **반응형 디자인**: 다양한 화면 크기에 대응하기 위해 레이아웃을 반응형으로 설계하는 것이 중요합니다.\n\n## 그리드 시스템 활용하기\n그리드 시스템을 활용하여 요소들을 배치하고 정렬하는 방법을 익혀봅시다. 그리드 시스템을 활용하면 디자인 작업을 효율적으로 수행할 수 있습니다.\n\n이러한 내용을 학습하고 익힘으로써 효율적인 레이아웃과 그리드 시스템을 활용하는 방법을 숙지할 수 있을 것입니다.',
  })
  @IsArray()
  chapterContent: string;
}

export class ChapterComplateResponseDTO {
  @ApiProperty({
    description: '결과',
    example:
      '나는 피그마 학습에 도전했다. 레이아웃과 그리드를 균형 있게 배치하는 법을 배우며, 조화로운 디자인을 완성해냈다. 다양한 화면 크기에 맞춰 반응형 디자인을 구현하는 과정에서 새로운 가능성을 발견했다. 이제는 레이아웃과 그리드 시스템을 마스터한 나는 창의적인 디자인을 만들어낼 준비가 되어있는 것 같다.',
  })
  @IsString()
  content: string;

  @ApiProperty({
    description: '이미지 URL',
    example: 'https://oaidalleapiprodscus.blob.core.windows.net',
  })
  @IsString()
  url: string;
}
