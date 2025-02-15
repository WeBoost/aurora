import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { Configuration, OpenAIApi } from 'https://esm.sh/openai@4.11.0';

const openai = new OpenAIApi(
  new Configuration({
    apiKey: Deno.env.get('OPENAI_API_KEY'),
  })
);

serve(async (req) => {
  try {
    const { type, context } = await req.json();

    const prompt = generatePrompt(type, context);
    const completion = await openai.createChatCompletion({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are an expert content writer and SEO specialist.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
    });

    const content = completion.data.choices[0].message?.content;
    if (!content) throw new Error('No content generated');

    const result = parseAIResponse(content, type);

    return new Response(
      JSON.stringify(result),
      {
        headers: { 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});

function generatePrompt(type: string, context: any): string {
  switch (type) {
    case 'content':
      return `
        Generate website content for a ${context.businessType} in ${context.location || 'Iceland'}.
        ${context.service ? `Focus on the ${context.service} service.` : ''}
        Use a ${context.tone || 'professional'} tone.
        Target these keywords: ${context.keywords?.join(', ') || 'relevant industry terms'}.
        
        Include:
        1. SEO-optimized page title
        2. Meta description
        3. Main content sections with headings
        4. Calls to action
        5. Structured data for rich snippets
        
        Format the response as JSON with these sections:
        {
          "title": "SEO title",
          "description": "Meta description",
          "keywords": ["keyword1", "keyword2"],
          "content": {
            "sections": [
              {
                "type": "hero",
                "content": { ... }
              },
              ...
            ]
          },
          "structuredData": { ... }
        }
      `;

    case 'template':
      return `
        Generate a website template structure for a ${context.businessType}.
        Include common sections and components needed for this type of business.
        Use a ${context.tone || 'professional'} tone.
        
        Format the response as JSON with these sections:
        {
          "sections": [
            {
              "type": "string",
              "title": "string",
              "description": "string",
              "fields": [
                {
                  "name": "string",
                  "type": "string",
                  "description": "string"
                }
              ]
            }
          ],
          "seo": {
            "titleTemplate": "string",
            "descriptionTemplate": "string",
            "keywordsTemplate": "string"
          }
        }
      `;

    default:
      throw new Error('Invalid generation type');
  }
}

function parseAIResponse(content: string, type: string): any {
  try {
    // Extract JSON from the response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('No valid JSON found in response');

    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    console.error('Failed to parse AI response:', error);
    throw new Error('Invalid AI response format');
  }
}