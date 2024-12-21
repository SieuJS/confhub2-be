// src/conferences/model.service.ts
import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import csv from 'csv-parser';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { join } from 'path';
interface PromptParts {
  inputPart1: string;
  inputPart2: string;
  inputPart3: string;
  inputPart4: string;
  outputPart1: string;
  outputPart2: string;
  outputPart3: string;
  outputPart4: string;
}
const apiKey = "AIzaSyAV319MCiDorKNeNykl68MAzlIJk6YRz3g";
@Injectable()
export class GeminiApiService {
    constructor(
        private readonly genAI:  GoogleGenerativeAI
    )
     {
        this.genAI = new GoogleGenerativeAI(apiKey);
    }


  private async readPromptCSV(filePath: string): Promise<PromptParts> {
    const results : any[] = [];
    return new Promise<PromptParts>((resolve, reject) => {
      fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (data) => results.push(data))
        .on('end', () => {
          if (results.length < 4) {
            reject(new Error('Insufficient data in CSV'));
          } else {
            resolve({
              inputPart1: results[0].input,
              inputPart2: results[1].input,
              inputPart3: results[2].input,
              inputPart4: results[3].input,
              outputPart1: results[0].output,
              outputPart2: results[1].output,
              outputPart3: results[2].output,
              outputPart4: results[3].output,
            });
          }
        })
        .on('error', (error) => reject(error));
    });
  }

  public async processConferences(
    batch: string,
    numConferences: number,
  ): Promise<string> {

    const csvPath = join(__dirname, '../promt/geminiapi.csv');
    try {
      const {
        inputPart1,
        inputPart2,
        inputPart3,
        inputPart4,
        outputPart1,
        outputPart2,
        outputPart3,
        outputPart4,
      } = await this.readPromptCSV(csvPath);

      const parts = [
        { text: `${inputPart1}` },
        { text: `${outputPart1}` },
        { text: `${inputPart2}` },
        { text: `${outputPart2}` },
        { text: `${inputPart3}` },
        { text: `${outputPart3}` },
        { text: `${inputPart4}` },
        { text: `${outputPart4}` },
        { text: `input_${numConferences}: \n${batch}` },
        { text: `output_${numConferences}: ` },
      ];

      const systemInstruction = `
      Role: You are a meticulous data processor responsible for extracting and formatting information about conferences. Your primary goal is to ensure the highest level of accuracy and consistency in the output.

      Instruction:
        1. Output Format Enforcement: You must strictly adhere to the exact format demonstrated in the provided few-shot examples. Do not return the output in JSON or any other format.
        2. Complete and Ordered Output Requirement: You must generate a final output, labeled output_${numConferences}, containing information for all ${numConferences} conferences listed in the input_${numConferences}. The conferences in output_${numConferences} must appear in the precise order they are presented in input_${numConferences}. Do not omit any conference, and do not reorder the conferences.
        3. Information Source Restriction: For each conference within output_${numConferences}, you must use only the specific data provided for that conference within input_${numConferences}. Do not introduce any external information or data from other conferences. You must not infer, extrapolate, or combine data from any other source.
        4. Conference Data Integrity: You must ensure that output_${numConferences} reflects the exact name of each conference as given in input_${numConferences} and that the total count of conferences remains at ${numConferences}. Additionally, the order of conferences within output_${numConferences} must be identical to the order given in input_${numConferences}. You are responsible for data integrity.

      Situation: You are provided with a list of ${numConferences} conferences in input_${numConferences}. Your task is to process this data and present it according to the specific instructions provided above, referencing the output format demonstrated in the provided few-shot examples.
      `;

      const model = this.genAI.getGenerativeModel({
        model: 'gemini-1.5-flash-latest',
        systemInstruction,
      });

      const response = await model.generateContent({
        contents: [{ role: 'user', parts }],
        generationConfig: {
          temperature: 0.7,
        maxOutputTokens: 2000,
        },
      });

      return response.response.text();
    } catch (error) {
      console.error('Error processing conferences:', error);
      throw new Error('Failed to process conferences');
    }
  }
}
