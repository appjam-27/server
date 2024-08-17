import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';

@Injectable()
export class GptService {
  constructor(private readonly configService: ConfigService) {
    // test
    this.makeChapter('피그마 배우기').then((chapters) => console.log(chapters));
  }

  #openai = new OpenAI({
    apiKey: this.configService.get<string>('OPENAI_API_KEY'),
  });
  #chapterCount = 4;

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

    const chapters = Array.from({ length: this.#chapterCount }).map((_, i) => ({
      title: res[`chapterTitle${i + 1}`],
      desc: res[`chapterDesc${i + 1}`],
      duration: res[`chapterDuration${i + 1}`],
    }));

    return chapters;
  }
}
