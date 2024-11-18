import { Mistral } from '@mistralai/mistralai';
import dotenv from 'dotenv';

dotenv.config();

const client = new Mistral({
  apiKey: process.env.MISTRALAI_KATE_API_KEY
});

export const handler = async (event) => {
  if (!event.body) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "No request body provided" })
    };
  }

  try {
    const { message } = JSON.parse(event.body);
    
    if (!message) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Message is required" })
      };
    }

    const chatResponse = await client.agents.complete({
      agentId: process.env.MISTRALAI_KATE_AGENT_ID,
      messages: [{ role: 'user', content: message }]
    });

    return {
      statusCode: 200,
      body: JSON.stringify({
        response: chatResponse.choices[0].message.content
      })
    };
  } catch (error) {
    console.error('Error:', error.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal server error" })
    };
  }
};