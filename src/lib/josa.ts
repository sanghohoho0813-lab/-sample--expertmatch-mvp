/** 받침 유무에 맞춰 조사를 고른다 — '팀이라면' / '대표라면' */
export function josa(word: string, withBatchim: string, withoutBatchim: string): string {
  const last = word.trim().slice(-1);
  const code = last.charCodeAt(0) - 0xac00;
  if (code < 0 || code > 11171) return word + withBatchim;
  return word + (code % 28 === 0 ? withoutBatchim : withBatchim);
}
