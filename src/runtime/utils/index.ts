import type { BlockObjectResponse } from '@notionhq/client'
import type { NotionAnnotations, NotionColor } from '../types/notion'

export function isNotionBlockType<
  T extends BlockObjectResponse,
  U extends T['type'],
>(block: T, ...types: U[]): block is T & { type: U } {
  for (const t of types) if (t === block.type) return true
  return false
}

const colorsMap: Record<NotionColor, string> = {
  default: '',
  gray: 'notion-color-gray',
  brown: 'notion-color-brown',
  orange: 'notion-color-orange',
  yellow: 'notion-color-yellow',
  green: 'notion-color-green',
  blue: 'notion-color-blue',
  purple: 'notion-color-purple',
  pink: 'notion-color-pink',
  red: 'notion-color-red',

  gray_background: 'notion-bg-gray',
  brown_background: 'notion-bg-brown',
  orange_background: 'notion-bg-orange',
  yellow_background: 'notion-bg-yellow',
  green_background: 'notion-bg-green',
  blue_background: 'notion-bg-blue',
  purple_background: 'notion-bg-purple',
  pink_background: 'notion-bg-pink',
  red_background: 'notion-bg-red',
  default_background: 'notion-bg-default',
}

export const notionColorToCss = (color: NotionColor) => {
  return colorsMap[color] || colorsMap.default
}

export const notionAnnotationsToCss = (annotations: NotionAnnotations) => {
  const classes: string[] = []

  if (annotations.strikethrough) classes.push('notion-strikethrough')
  if (annotations.underline) classes.push('notion-underline')
  if (annotations.bold) classes.push('notion-bold')
  if (annotations.italic) classes.push('notion-italic')

  classes.push(notionColorToCss(annotations.color))

  return classes
}
