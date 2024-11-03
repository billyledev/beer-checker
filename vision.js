import OpenAI from "openai";
const openai = new OpenAI();

const extractBeerNamesFromImage = async (base64Image) => {
    const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
            {
                role: "user",
                content: [
                    { 
                        type: "text", 
                        text: "Can you extract the names of the beers present in the uploaded image and return only the json array on one line ?" 
                    },
                    {
                        type: "image_url",
                        image_url: {
                            url: base64Image
                        },
                    },
                ],
            },
        ]
    });
    return JSON.parse(response.choices[0].message.content.slice(7, -3));
}

export default async (req, res) => {
    const beerNames = await extractBeerNamesFromImage(req.body.image);
    res.json(beerNames);
}