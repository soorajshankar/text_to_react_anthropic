import { NextRequest, NextResponse } from 'next/server';

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const MAX_RETRIES = 3;

const SYSTEM_PROMPT = `You are a React component generator. Generate a complete, self-contained HTML file that can run in an iframe.

Follow these rules:
1. Generate a complete HTML document with all necessary scripts and styles
2. Include any required CDN dependencies for your specific component
3. Component should be named 'MyComponent'
4. Use Tailwind CSS for styling
5. Include sample data within the component if needed
6. No explanations or comments
7. Component must be self-contained
8. Include error handling for runtime errors
9. Include ReactDOM.render to mount the component

Example structure (adapt as needed):
<!DOCTYPE html>
<html>
  <head>
    <!-- Include only the CDN dependencies you need -->
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://cdn.jsdelivr.net/npm/react@18/umd/react.production.min.js"></script>
    <!-- Add other dependencies as needed -->
  </head>
  <body>
    <div id="root"></div>
    <script type="text/babel">
      // Your component code here
    </script>
    <script src="https://unpkg.com/babel-standalone@6/babel.min.js"></script>
  </body>
</html>`;

function validateGeneratedCode(code: string): boolean {
  console.log('Validating generated code...');
  
  // Basic validation checks
  const hasDoctype = code.includes('<!DOCTYPE html>');
  const hasMyComponent = code.includes('MyComponent');
  const hasReactDOMRender = code.includes('ReactDOM.render');
  const noMarkdown = !code.includes('```');
  
  console.log('Validation results:', {
    hasDoctype,
    hasMyComponent,
    hasReactDOMRender,
    noMarkdown
  });
  
  return hasDoctype && hasMyComponent && hasReactDOMRender && noMarkdown;
}

function sanitizeCode(code: string): string {
  console.log('Sanitizing code...');
  console.log('Original code length:', code.length);
  
  // Remove markdown backticks and language specifications
  let cleaned = code.replace(/```(html|jsx|javascript|typescript)?\n/g, '');
  cleaned = cleaned.replace(/```/g, '');
  
  console.log('Sanitized code length:', cleaned.length);
  return cleaned.trim();
}

async function generateWithRetry(prompt: string, retryCount = 0): Promise<string> {
  console.log(`Generating code... (attempt ${retryCount + 1}/${MAX_RETRIES + 1})`);
  
  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY!,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-sonnet-20240229',
        max_tokens: 4000,
        messages: [{
          role: 'user',
          content: `${SYSTEM_PROMPT}\n\nGenerate a React component based on this request: ${prompt}`
        }]
      })
    });

    const data = await response.json();
    console.log('API Response status:', response.status);
    
    if (!response.ok) {
      console.error('API Error:', data);
      throw new Error(`API request failed: ${response.status}`);
    }

    let generatedCode = data.content[0].text;
    console.log('Raw generated code length:', generatedCode.length);
    
    generatedCode = sanitizeCode(generatedCode);

    if (!validateGeneratedCode(generatedCode)) {
      console.warn('Generated code validation failed');
      if (retryCount < MAX_RETRIES) {
        console.log(`Retrying generation (attempt ${retryCount + 2})`);
        return generateWithRetry(prompt, retryCount + 1);
      }
      throw new Error('Failed to generate valid component after max retries');
    }

    return generatedCode;
  } catch (error) {
    console.error('Error in generateWithRetry:', error);
    if (retryCount < MAX_RETRIES) {
      console.log(`Error occurred, retrying (attempt ${retryCount + 2})`);
      return generateWithRetry(prompt, retryCount + 1);
    }
    throw error;
  }
}

export async function POST(req: NextRequest) {
  console.log('Received POST request');
  
  try {
    const { prompt } = await req.json();
    console.log('Received prompt:', prompt);

    const html = await generateWithRetry(prompt);
    console.log('Successfully generated code');

    return new NextResponse(html, {
      headers: {
        'Content-Type': 'text/html',
      },
    });
  } catch (error) {
    console.error('Error in POST handler:', error);
    return NextResponse.json({ error: 'Failed to generate component' }, { status: 500 });
  }
}
