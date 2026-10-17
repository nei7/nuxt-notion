/** Letters that Unicode normalisation does not decompose into ASCII + marks. */
const TRANSLITERATIONS: Record<string, string> = {
  ł: 'l', ø: 'o', đ: 'd', ß: 'ss', æ: 'ae', œ: 'oe', þ: 'th', ð: 'd',
}

/** Turns heading text into a URL-safe anchor id. */
export function slugifyHeading(text: string): string {
  const slug = text
    .replace(/[łøđßæœþð]/gi, char => TRANSLITERATIONS[char.toLowerCase()] ?? char)
    .normalize('NFKD')
    .replace(/\p{M}/gu, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)
    .replace(/-+$/, '')

  return slug || 'section'
}

/** Appends `-2`, `-3`, … to repeated ids, keeping the first occurrence untouched. */
export function dedupeIds(ids: string[]): string[] {
  const seen = new Map<string, number>()

  return ids.map((id) => {
    const count = seen.get(id) ?? 0
    seen.set(id, count + 1)
    return count === 0 ? id : `${id}-${count + 1}`
  })
}
