import OpenAI from 'openai';

// Generate an image

const openai = new OpenAI({
  apiKey: process.env.XAI_API_KEY,
  baseURL: "https://api.x.ai/v1",
});

const response = await openai.images.generate({
  model: "grok-2-image",
  prompt: "A cat in a tree",
});
console.log(response.data[0].url);

// Generate multiple images

// const openai = new OpenAI({
//   apiKey: "<api key>",
//   baseURL: "https://api.x.ai/v1",
// });

// const response = await openai.images.generate({
//   model: "grok-2-image",
//   prompt: "A cat in a tree",
//   n: 4
// });
// response.data.forEach((image) => {
//   console.log(image.url);
// });