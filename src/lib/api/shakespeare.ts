import { stripHtmlTags, decodeHtmlEntities } from '../utils/text';

export const PLAY_CODES = [
  'AWW',  // All's Well That Ends Well
  'Ant',  // Antony and Cleopatra
  'AYL',  // As You Like It
  'Err',  // The Comedy of Errors
  'Cor',  // Coriolanus
  'Cym',  // Cymbeline
  'Ham',  // Hamlet
  '1H4',  // Henry IV, Part 1
  '2H4',  // Henry IV, Part 2
  'H5',   // Henry V
  '1H6',  // Henry VI, Part 1
  '2H6',  // Henry VI, Part 2
  '3H6',  // Henry VI, Part 3
  'H8',   // Henry VIII
  'JC',   // Julius Caesar
  'Jn',   // King John
  'Lr',   // King Lear
  'LLL',  // Love's Labor's Lost
  'Mac',  // Macbeth
  'MM',   // Measure for Measure
  'MV',   // The Merchant of Venice
  'Wiv',  // The Merry Wives of Windsor
  'MND',  // A Midsummer Night's Dream
  'Ado',  // Much Ado About Nothing
  'Oth',  // Othello
  'Per',  // Pericles
  'R2',   // Richard II
  'R3',   // Richard III
  'Rom',  // Romeo and Juliet
  'Shr',  // The Taming of the Shrew
  'Tmp',  // The Tempest
  'Tim',  // Timon of Athens
  'Tit',  // Titus Andronicus
  'Tro',  // Troilus and Cressida
  'TN',   // Twelfth Night
  'TGV',  // Two Gentlemen of Verona
  'TNK',  // Two Noble Kinsmen
  'WT'    // The Winter's Tale
] as const;

export async function fetchShakespeareText(numWords: number = 100): Promise<string> {
  const randomPlayCode = PLAY_CODES[Math.floor(Math.random() * PLAY_CODES.length)];
  
  const playTextResponse = await fetch(`https://www.folgerdigitaltexts.org/${randomPlayCode}/text`);
  if (!playTextResponse.ok) {
    throw new Error(`Failed to fetch play text for ${randomPlayCode}`);
  }
  
  const playText = await playTextResponse.text();
  
  let cleanText = playText.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  cleanText = cleanText.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '');
  
  const parser = new DOMParser();
  const doc = parser.parseFromString(cleanText, 'text/html');
  let fullText = '';
  
  if (doc.body) {
    fullText = doc.body.textContent || doc.body.innerText || '';
  } else {
    fullText = stripHtmlTags(cleanText);
  }
  
  fullText = decodeHtmlEntities(fullText);
  
  const allWords = fullText.split(/\s+/).filter(word => word.trim().length > 0);
  
  if (allWords.length < numWords) {
    throw new Error('Play text does not contain enough words');
  }
  
  const maxStartIndex = allWords.length - numWords;
  const randomStartIndex = Math.floor(Math.random() * (maxStartIndex + 1));
  const selectedWords = allWords.slice(randomStartIndex, randomStartIndex + numWords);
  
  return selectedWords.join(' ');
}

