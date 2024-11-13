import type Hapi from '@hapi/hapi';
import Joi from 'joi';
import { StatusCodes } from 'http-status-codes';
import OpenAI from 'openai';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY ?? '';

const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
});

interface RequestPayload {
  image: string;
}

const extractBeerNamesFromImage = async (base64Image: string) => {
  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'user',
        content: [
          { 
            type: 'text', 
            text: 'Can you extract the names of the beers present in the uploaded image and return only the json array on one line ?',
          },
          {
            type: 'image_url',
            image_url: {
              url: base64Image,
            },
          },
        ],
      },
    ],
  });
  const firstResponse = response.choices[0].message.content || '';
  return JSON.parse(firstResponse.slice(7, -3));
};

async function analyzeHandler(request: Hapi.Request, h: Hapi.ResponseToolkit): Promise<APIResponse> {
  const { image } = request.payload as RequestPayload;
  const beerNames = await extractBeerNamesFromImage(image);
  return h.response(beerNames).code(StatusCodes.OK);
}

interface VisionPluginData {
  name: string;
  version: string;
}

const internals: VisionPluginData = {
  name: 'app/vision',
  version: '1.0.0',
};

const visionPlugin = {
  name: internals.name,
  version: internals.version,
  dependencies: [],
  register: async (server: Hapi.Server) => {
    if (OPENAI_API_KEY === '') {
      throw new Error('OPENAI_API_KEY is empty');
    }

    server.route([
      {
        method: 'POST',
        path: '/analyze',
        handler: analyzeHandler,
        options: {
          validate: {
            payload: Joi.object({
              image: Joi.string().base64().required(),
            }),
          },
        },
      },
    ]);
  },
};

export {
  internals as VisionPluginInfos,
};

export default visionPlugin;
