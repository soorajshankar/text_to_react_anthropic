import { NextRequest, NextResponse } from 'next/server';

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
</html>

--- EXAMPLE 1 START ---

Prompt: "create a bar chart shows continents and its approximate population, mark in different colours"
Output:

<!DOCTYPE html>
<html>
  <head>
    <script src="https://cdn.tailwindcss.com"></script>
    <script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
    <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
  </head>
  <body>
    <div id="root" class="flex justify-center items-center h-screen"></div>
    <script type="text/babel">
      const data = {
        labels: ['Asia', 'Africa', 'Europe', 'North America', 'South America', 'Australia'],
        datasets: [
          {
            label: 'Population (millions)',
            data: [4641, 1340, 747, 592, 432, 43],
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(255, 206, 86, 0.2)',
              'rgba(75, 192, 192, 0.2)',
              'rgba(153, 102, 255, 0.2)',
              'rgba(255, 159, 64, 0.2)',
            ],
            borderColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)',
              'rgba(255, 159, 64, 1)',
            ],
            borderWidth: 1,
          },
        ],
      };

      const MyComponent = () => {
        const chartRef = React.useRef(null);

        React.useEffect(() => {
          const chart = new Chart(chartRef.current, {
            type: 'bar',
            data: data,
            options: {
              scales: {
                y: {
                  beginAtZero: true,
                },
              },
            },
          });

          return () => {
            chart.destroy();
          };
        }, []);

        return <canvas ref={chartRef} className="w-full h-96"></canvas>;
      };

      const rootNode = document.getElementById('root');
      ReactDOM.render(<MyComponent />, rootNode);
    </script>
    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  </body>
</html>

--- EXAMPLE END ---

--- EXAMPLE 2 START ---

Prompt: "create a table with 100 mock data rows and 10 columns with every cell accessible via scrolling and with pagination"

Output:
<!DOCTYPE html>
<html>
  <head>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://cdn.jsdelivr.net/npm/react@18/umd/react.production.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/react-dom@18/umd/react-dom.production.min.js"></script>
  </head>
  <body>
    <div id="root"></div>
    <script type="text/babel">
      const mockData = [];
      for (let i = 0; i < 100; i++) {
        const row = [];
        for (let j = 0; j < 10; j++) {
          row.push(\`Cell \${i}-\${j}\`);
        }
        mockData.push(row);
      }

      const MyComponent = () => {
        const [currentPage, setCurrentPage] = React.useState(1);
        const itemsPerPage = 10;
        const totalPages = Math.ceil(mockData.length / itemsPerPage);

        const handlePageChange = (pageNumber) => {
          setCurrentPage(pageNumber);
        };

        const indexOfLastItem = currentPage * itemsPerPage;
        const indexOfFirstItem = indexOfLastItem - itemsPerPage;
        const currentItems = mockData.slice(indexOfFirstItem, indexOfLastItem);

        return (
          <div className="flex flex-col">
            <div className="overflow-x-auto">
              <div className="inline-block min-w-full shadow-md rounded-lg overflow-hidden">
                <table className="min-w-full leading-normal">
                  <thead>
                    <tr>
                      {Array.from({ length: 10 }, (_, i) => (
                        <th
                          key={i}
                          className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
                        >
                          Column {i + 1}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {currentItems.map((row, rowIndex) => (
                      <tr key={rowIndex}>
                        {row.map((cell, cellIndex) => (
                          <td
                            key={\`\${rowIndex}-\${cellIndex}\`}
                            className="px-5 py-5 border-b border-gray-200 bg-white text-sm"
                          >
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="flex justify-center mt-4">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i + 1}
                  className={\`mx-1 px-3 py-2 rounded-md \${
                    currentPage === i + 1
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-700'
                  }\`}
                  onClick={() => handlePageChange(i + 1)}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </div>
        );
      };

      const ErrorBoundary = class extends React.Component {
        constructor(props) {
          super(props);
          this.state = { hasError: false };
        }

        static getDerivedStateFromError(error) {
          return { hasError: true };
        }

        componentDidCatch(error, errorInfo) {
          console.error('Error:', error, errorInfo);
        }

        render() {
          if (this.state.hasError) {
            return <h1>Something went wrong.</h1>;
          }

          return this.props.children;
        }
      };

      ReactDOM.render(
        <ErrorBoundary>
          <MyComponent />
        </ErrorBoundary>,
        document.getElementById('root')
      );
    </script>
    <script src="https://unpkg.com/babel-standalone@6/babel.min.js"></script>
  </body>
</html>

--- EXAMPLE 2 END ---
`;

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

async function generateWithRetry(prompt: string, apiKey: string, retryCount = 0): Promise<string> {
  console.log(`Generating code... (attempt ${retryCount + 1}/${MAX_RETRIES + 1})`);
  
  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
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
        return generateWithRetry(prompt, apiKey, retryCount + 1);
      }
      throw new Error('Failed to generate valid component after max retries');
    }

    return generatedCode;
  } catch (error) {
    console.error('Error in generateWithRetry:', error);
    if (retryCount < MAX_RETRIES) {
      console.log(`Error occurred, retrying (attempt ${retryCount + 2})`);
      return generateWithRetry(prompt, apiKey, retryCount + 1);
    }
    throw error;
  }
}

export async function POST(request: NextRequest) {
  try {
    const { prompt, apiKey } = await request.json();
    
    if (!prompt) {
      return new NextResponse('Missing prompt', { status: 400 });
    }

    const effectiveApiKey = apiKey || process.env.ANTHROPIC_API_KEY;
    
    if (!effectiveApiKey) {
      return new NextResponse('No API key provided', { status: 400 });
    }

    const result = await generateWithRetry(prompt, effectiveApiKey);
    return new NextResponse(result);
  } catch (error) {
    console.error('Error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
