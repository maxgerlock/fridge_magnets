export function stripHtmlTags(text: string): string {
  const tmp = document.createElement('div');
  tmp.innerHTML = text;
  return tmp.textContent || tmp.innerText || '';
}

export function decodeHtmlEntities(text: string): string {
  const tmp = document.createElement('div');
  tmp.innerHTML = text;
  return tmp.textContent || tmp.innerText || text;
}

export function cleanWord(word: string): string | null {
  word = word.trim();
  if (word.length === 0) return null;
  
  word = word.replace(/<[^>]*>/g, '');
  word = decodeHtmlEntities(word);
  word = word.replace(/[<>]/g, '');
  
  word = word.trim();
  if (word.length === 0) return null;
  
  const hasInternalPeriods = /[A-Za-z0-9]\.[A-Za-z0-9]/.test(word);
  const punctuationRegex = /[!"#$%&'()*+,\-/:;<=>?@\[\\\]^_`{|}~]/;
  
  let i = 0;
  while (i < word.length && punctuationRegex.test(word[i])) {
    i++;
  }
  
  let j = word.length - 1;
  if (hasInternalPeriods) {
    while (j >= i && punctuationRegex.test(word[j])) {
      j--;
    }
  } else {
    while (j >= i && /[!"#$%&'()*+,\-./:;<=>?@\[\\\]^_`{|}~]/.test(word[j])) {
      j--;
    }
  }
  
  const cleaned = word.slice(i, j + 1);
  
  if (cleaned.length === 0) return null;
  
  return cleaned.toLowerCase();
}

