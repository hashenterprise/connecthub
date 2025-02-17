export async function fetchClaudeAIResponse(query: string): Promise<string> {
    // Replace with the actual API endpoint and request details for Claude AI
    const response = await fetch('https://api.claude.ai/endpoint', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer YOUR_API_KEY`,
      },
      body: JSON.stringify({ query }),
    });
  
    if (!response.ok) {
      throw new Error('Failed to fetch data from Claude AI');
    }
  
    const data = await response.json();
    return data.response; // Adjust based on the actual response structure
  }