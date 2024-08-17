import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiOkResponse } from '@nestjs/swagger';
import { NewGoalDTO, NewGoalResponseDTO } from './dto/newGoal.dto';
import { GptService } from './gpt.service';
import { UpdateStoryDTO, UpdateStoryResponseDTO } from './dto/updateStory.dto';
import {
  ChapterContentDTO,
  ChapterContentResponseDTO,
} from './dto/chapterContent.dto';

@Controller('gpt')
export class GptController {
  constructor(private readonly gptService: GptService) {}

  @Post('goal/new')
  @ApiBody({ type: NewGoalDTO })
  @ApiOkResponse({ description: 'Create a new goal', type: NewGoalResponseDTO })
  async createGoal(@Body() dto: NewGoalDTO) {
    return {
      goal: dto.goal,
      icon: await this.gptService.selectIcon(dto.goal),
      chapters: await this.gptService.makeChapter(dto.goal),
      story: await this.gptService.makeFirstStory(dto.goal),
    };
  }

  @Post('story/update')
  @ApiBody({ type: UpdateStoryDTO })
  @ApiOkResponse({
    description: 'Update a story',
    type: UpdateStoryResponseDTO,
  })
  async updateStory(@Body() dto: UpdateStoryDTO) {
    return {
      content: await this.gptService.makeStory(dto.goal, dto.chapters),
    };
  }

  @Post('chapter/content')
  @ApiBody({ type: ChapterContentDTO })
  @ApiOkResponse({
    description: 'Get chapter content',
    type: ChapterContentResponseDTO,
  })
  async getChapterContent(@Body() dto: ChapterContentDTO) {
    return {
      content: await this.gptService.makeChapterContent(dto.goal, dto.chapter),
    };
  }
}
