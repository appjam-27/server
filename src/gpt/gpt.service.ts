import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import { ChapterModel, StoryModel } from './gpt.model';

@Injectable()
export class GptService {
  constructor(private readonly configService: ConfigService) {}

  #openai = new OpenAI({
    apiKey: this.configService.get<string>('OPENAI_API_KEY'),
  });
  #chapterCount = 4;
  #iconList = ['design', 'activities', 'social', 'business', 'movies', 'dev'];

  async selectIcon(goal: string) {
    const completion = await this.#openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      functions: [
        {
          name: 'selectIcon',
          description: '목표와 관련된 아이콘을 선택합니다.',
          parameters: {
            type: 'object',
            properties: {
              icon: {
                type: 'string',
                description: `목표와 관련된 아이콘 (${this.#iconList.join(', ')}) 중 하나를 선택해주세요.`,
              },
            },
            required: ['icon'],
          },
        },
      ],
      function_call: 'auto',
      messages: [
        {
          role: 'system',
          content: `너는 유저의 목표에 대한 아이콘을 선택하는 어시스턴트야.`,
        },
        {
          role: 'user',
          content: `다음 목표와 관련된 아이콘을 선택해줘. ${goal}`,
        },
      ],
    });

    const res: { icon: string } = JSON.parse(
      completion.choices[0].message.function_call.arguments,
    );

    return res.icon;
  }

  makeFnCallParameters() {
    const parameters = {
      type: 'object',
      properties: {},
      required: [
        ...Array.from({ length: this.#chapterCount }).map(
          (_, i) => `chapterTitle${i + 1}`,
        ),
        ...Array.from({ length: this.#chapterCount }).map(
          (_, i) => `chapterDesc${i + 1}`,
        ),
        ...Array.from({ length: this.#chapterCount }).map(
          (_, i) => `chapterDuration${i + 1}`,
        ),
      ],
    };

    for (let i = 1; i <= this.#chapterCount; i++) {
      parameters.properties[`chapterTitle${i}`] = {
        type: 'string',
        description: `챕터 제목 ${i}`,
      };
      parameters.properties[`chapterDesc${i}`] = {
        type: 'string',
        description: `챕터 설명 ${i}`,
      };
      parameters.properties[`chapterDuration${i}`] = {
        type: 'string',
        description: `챕터 소요 시간 ${i}`,
      };
    }

    return parameters;
  }

  async makeChapter(goal: string) {
    const parameters = this.makeFnCallParameters();
    const completion = await this.#openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      functions: [
        {
          name: 'genChapter',
          description: '목표 달성을 위한 챕터를 추가합니다.',
          parameters: parameters,
        },
      ],
      function_call: 'auto',
      temperature: 1.2,
      messages: [
        {
          role: 'system',
          content: `너는 유저의 목표를 이루기 위해 도와주는 어시스턴트야.`,
        },
        {
          role: 'user',
          content: `다음 목표를 이루기 위해 챕터를 하나씩 해결해가며 목표를 달성할 건데,
          소요 시간이 5시간 이내인 챕터들을 4개 추천해줘. ${goal}`,
        },
      ],
    });

    const res = JSON.parse(
      completion.choices[0].message.function_call.arguments,
    );

    const chapters: ChapterModel[] = Array.from({
      length: this.#chapterCount,
    }).map((_, i) => ({
      title: res[`chapterTitle${i + 1}`],
      desc: res[`chapterDesc${i + 1}`],
      duration: res[`chapterDuration${i + 1}`],
    }));

    return chapters;
  }

  async makeFirstStory(goal: string) {
    const completion = await this.#openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      max_tokens: 300,
      functions: [
        {
          name: 'makeStory',
          description: '스토리텔링 소설을 작성합니다.',
          parameters: {
            type: 'object',
            properties: {
              title: {
                type: 'string',
                description: '소설 제목',
              },
              content: {
                type: 'string',
                description: '소설 내용',
              },
            },
            required: ['title', 'content'],
          },
        },
      ],
      messages: [
        {
          role: 'system',
          content: `너는 유저의 목표를 이루기 위해 도와주는 어시스턴트야.`,
        },
        {
          role: 'user',
          content: `다음 목표를 이루기 위해 챕터을 해결하며 처음 지식을 쌓는 심정에 대한 1인칭 소설 스토리텔링을 80자 이내로 써줘. ${goal}`,
        },
      ],
    });

    const res: StoryModel = JSON.parse(
      completion.choices[0].message.function_call.arguments,
    );

    return res;
  }

  async makeStory(goal: string, chapters: ChapterModel[]) {
    const completion = await this.#openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: `너는 유저의 목표를 이루기 위해 도와주는 어시스턴트야.`,
        },
        {
          role: 'user',
          content: `다음 목표를 이루기 위해 아래의 ${chapters.length}개의 챕터를 해결하여 목표를 다가가는 60자 이내의 문단 없는 1인칭 줄글 소설 스토리텔링을 작성해줘.
          ${goal}.
          ${chapters.map(
            (chapter, i) => `${i + 1}. ${chapter.title}, ${chapter.desc}`,
          )}`,
        },
      ],
    });

    return completion.choices[0].message.content;
  }

  async makeChapterContent(goal: string, { title, desc }: ChapterModel) {
    const completion = await this.#openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: `너는 유저의 목표를 이루기 위해 도와주는 어시스턴트야. 너의 출력은 모두 마크다운 형식이여야 해.`,
        },
        {
          role: 'user',
          content: `다음 목표를 이루기 위해 챕터를 진행하여 공부해야 해.
          '${title} - ${desc}'에 대한 내용을 마크다운으로 작성해줘.
          양식은 소제목 3개 이상으로 구성되었으면 좋겠어.
          ${goal}`,
        },
      ],
    });

    return completion.choices[0].message.content;
  }

  async makeChapterComplatePage(goal: string, chapterContent: string) {
    const completion = await this.#openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: `너는 유저의 목표를 이루기 위해 도와주는 어시스턴트야. 너의 출력은 모두 마크다운 형식이여야 해.`,
        },
        {
          role: 'user',
          content: `다음 목표를 이루기 위해 챕터를 완료하고 공부한 소감을 정리해야 해.
          '${chapterContent}'에 대한 내용을 60자 이내의 문단 없는 1인칭 줄글 소설 스토리텔링로 작성해줘.
          ${goal}`,
        },
      ],
    });

    const content = completion.choices[0].message.content;

    const image = await this.#openai.images.generate({
      model: 'dall-e-3',
      prompt: content,
    });

    return {
      url: image.data[0].url,
      content,
    };
  }
}
