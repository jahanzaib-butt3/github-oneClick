import { Groq } from 'groq-sdk';

const getGroqClient = () => {
  const apiKey = import.meta.env.VITE_GROQ_API_KEY;
  
  if (!apiKey) {
    throw new Error('GROQ API key is not configured. Please add your API key to the .env file.');
  }

  return new Groq({
    apiKey,
    dangerouslyAllowBrowser: true // WARNING: This is not secure for production use
  });
};

export const generateChatResponse = async (messages: { role: string; content: string }[], model: string) => {
  try {
    const groq = getGroqClient();
    const completion = await groq.chat.completions.create({
      messages,
      model,
      temperature: 0.7,
      max_tokens: 1000,
      top_p: 1,
      stream: false,
      stop: null,
    });

    return completion.choices[0].message;
  } catch (error) {
    console.error('Error generating chat response:', error);
    if (error instanceof Error && error.message.includes('API key')) {
      throw new Error('API key configuration error. Please check your environment variables.');
    }
    throw error;
  }
};