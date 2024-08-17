import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiOkResponse } from '@nestjs/swagger';
import { NewGoalDTO, NewGoalResponseDTO } from './dto/newGoal.dto';
import { GptService } from './gpt.service';
import {
  ChapterContentDTO,
  ChapterContentResponseDTO,
} from './dto/chapterContent.dto';
import {
  ChapterComplateDTO,
  ChapterComplateResponseDTO,
} from './dto/chapterComplate.dto';

@Controller('gpt')
export class GptController {
  constructor(private readonly gptService: GptService) {}

  @Post('goal/new')
  @ApiBody({ type: NewGoalDTO })
  @ApiOkResponse({ description: 'Create a new goal', type: NewGoalResponseDTO })
  async createGoal(@Body() dto: NewGoalDTO): Promise<NewGoalResponseDTO> {
    const chapters = await this.gptService.makeChapter(dto.goal);
    const firstStory = await this.gptService.makeFirstStory(dto.goal);

    const stories = [
      firstStory.content,
      ...(await Promise.all(
        Array.from({ length: chapters.length }).map((_, i) => {
          return this.gptService.makeStory(dto.goal, chapters.slice(0, i + 1));
        }),
      )),
    ];

    return {
      goal: dto.goal,
      icon: await this.gptService.selectIcon(dto.goal),
      chapters: chapters,
      story: {
        title: firstStory.title,
        content: stories,
      },
    };
  }

  @Post('chapter/content')
  @ApiBody({ type: ChapterContentDTO })
  @ApiOkResponse({
    description: 'Get chapter content',
    type: ChapterContentResponseDTO,
  })
  async getChapterContent(
    @Body() dto: ChapterContentDTO,
  ): Promise<ChapterContentResponseDTO> {
    return {
      content: await this.gptService.makeChapterContent(dto.goal, dto.chapter),
    };
  }

  @Post('chapter/complete')
  @ApiBody({ type: ChapterComplateDTO })
  @ApiOkResponse({
    description: 'Complete a chapter',
    type: ChapterComplateResponseDTO,
  })
  async completeChapter(@Body() dto: ChapterComplateDTO) {
    return {
      content: await this.gptService.makeChapterComplatePage(
        dto.goal,
        dto.chapterContent,
      ),
    };
  }
}
