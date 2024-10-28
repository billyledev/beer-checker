const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.post('/rateBeer', async (req, res) => {

    const rateBeerRequestBody = {
        "operationName": "SearchResultsBeer",
        "variables": {
            "query": req.body.query,
            "order": "MATCH",
            "includePurchaseOptions": true,
            "latlng": [
                43.577999114990234,
                7.054500102996826
            ],
            "first": 10
        },
        "query": "query SearchResultsBeer($includePurchaseOptions: Boolean!, $latlng: [Float!]!, $query: String, $order: SearchOrder, $first: Int, $after: ID) {\n  results: beerSearch(query: $query, order: $order, first: $first, after: $after) {\n    totalCount\n    last\n    items {\n      review {\n        id\n        score\n        likedByMe\n        updatedAt\n        createdAt\n        __typename\n      }\n      beer {\n        id\n        name\n        style {\n          id\n          name\n          __typename\n        }\n        overallScore\n        styleScore\n        averageQuickRating\n        abv\n        ibu\n        brewer {\n          id\n          name\n          country {\n            id\n            code\n            __typename\n          }\n          __typename\n        }\n        contractBrewer {\n          id\n          name\n          country {\n            id\n            code\n            __typename\n          }\n          __typename\n        }\n        ratingsCount\n        imageUrl\n        isRetired\n        isAlias\n        purchaseOptions(options: {latlng: $latlng}) @include(if: $includePurchaseOptions) {\n          items {\n            productId\n            price\n            currency\n            currencySymbol\n            priceValue\n            store {\n              id\n              __typename\n            }\n            __typename\n          }\n          __typename\n        }\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n}\n"
    };

    const response = await fetch("https://beta.ratebeer.com/v1/api/graphql", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',  
        },
        body: JSON.stringify(rateBeerRequestBody)
    });

    console.log("RateBeer API status", response.status);
    const responseBody = await response.json();
    res.json(responseBody);
});

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}...`);
});