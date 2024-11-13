import type Hapi from '@hapi/hapi';
import Joi from 'joi';
import { StatusCodes } from 'http-status-codes';

interface RequestPayload {
  query: string;
}

const buildRateBeerApiRequest = (query: string) => {
  return {
    'operationName': 'SearchResultsBeer',
    'variables': {
      'query': query,
      'order': 'MATCH',
      'includePurchaseOptions': true,
      'latlng': [
        43.577999114990234,
        7.054500102996826,
      ],
      'first': 10,
    },
    'query': 'query SearchResultsBeer($includePurchaseOptions: Boolean!, $latlng: [Float!]!, $query: String, $order: SearchOrder, $first: Int, $after: ID) {\n  results: beerSearch(query: $query, order: $order, first: $first, after: $after) {\n    totalCount\n    last\n    items {\n      review {\n        id\n        score\n        likedByMe\n        updatedAt\n        createdAt\n        __typename\n      }\n      beer {\n        id\n        name\n        style {\n          id\n          name\n          __typename\n        }\n        overallScore\n        styleScore\n        averageQuickRating\n        abv\n        ibu\n        brewer {\n          id\n          name\n          country {\n            id\n            code\n            __typename\n          }\n          __typename\n        }\n        contractBrewer {\n          id\n          name\n          country {\n            id\n            code\n            __typename\n          }\n          __typename\n        }\n        ratingsCount\n        imageUrl\n        isRetired\n        isAlias\n        purchaseOptions(options: {latlng: $latlng}) @include(if: $includePurchaseOptions) {\n          items {\n            productId\n            price\n            currency\n            currencySymbol\n            priceValue\n            store {\n              id\n              __typename\n            }\n            __typename\n          }\n          __typename\n        }\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n}\n',
  };
};

async function rateHandler(request: Hapi.Request, h: Hapi.ResponseToolkit): Promise<APIResponse> {
  const { query } = request.payload as RequestPayload;
  const requestBody = buildRateBeerApiRequest(query);
  const response = await fetch('https://beta.ratebeer.com/v1/api/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',  
    },
    body: JSON.stringify(requestBody),
  });
  const responseBody = await response.json();
  return h.response(responseBody).code(StatusCodes.OK);
}

interface RatePluginData {
  name: string;
  version: string;
}

const internals: RatePluginData = {
  name: 'app/rate',
  version: '1.0.0',
};

const ratePlugin = {
  name: internals.name,
  version: internals.version,
  dependencies: [],
  register: async (server: Hapi.Server) => {
    server.route([
      {
        method: 'POST',
        path: '/rate',
        handler: rateHandler,
        options: {
          validate: {
            payload: Joi.object({
              query: Joi.string().required(),
            }),
          },
        },
      },
    ]);
  },
};

export {
  internals as RatePluginInfos,
};

export default ratePlugin;
