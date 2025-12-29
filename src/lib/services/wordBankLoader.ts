import { fetchShakespeareText } from '../api/shakespeare';
import { fetchRandomWords } from '../api/randomWords';

export type WordBankSource = 'shakespeare' | 'random';

export async function loadWordBank(source: WordBankSource): Promise<string> {
  let shakespeareText = '';
  
  if (source === 'shakespeare') {
    shakespeareText = await fetchShakespeareText(100);
  }
  
  const randomWords = await fetchRandomWords(100);
  
  if (source === 'shakespeare') {
    return shakespeareText + ' ' + randomWords.join(' ');
  } else {
    return randomWords.join(' ');
  }
}

