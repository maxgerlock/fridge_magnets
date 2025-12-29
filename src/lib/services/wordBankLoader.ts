import { fetchShakespeareText } from '../api/shakespeare';
import { fetchRandomWords } from '../api/randomWords';

export interface WordBankOptions {
  includeShakespeare: boolean;
  includeRandom: boolean;
}

export async function loadWordBank(options: WordBankOptions): Promise<string> {
  const parts: string[] = [];
  
  if (options.includeShakespeare) {
    const shakespeareText = await fetchShakespeareText(100);
    parts.push(shakespeareText);
  }
  
  if (options.includeRandom) {
    const randomWords = await fetchRandomWords(100);
    parts.push(randomWords.join(' '));
  }
  
  return parts.join(' ');
}

