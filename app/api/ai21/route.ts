import { AI21 } from 'ai21';

const client = new AI21({
  apiKey: process.env.AI21_API_KEY, // or pass it in directly
});

const response = await client.chat.completions.create({
  model: 'jamba-large',
  messages: [{ role: 'user', content: 'Hello, please provide a brief explanation of what AI21 does, in 100 words or less"' }],
});

console.log(response);