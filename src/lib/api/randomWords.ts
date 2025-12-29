export async function fetchRandomWords(count: number = 100): Promise<string[]> {
  const response = await fetch(`https://random-word-api.vercel.app/api?words=${count}`);
  if (!response.ok) {
    throw new Error('Failed to fetch random words');
  }
  return response.json();
}

