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
  default: 'text-gray-900 dark:text-gray-100',
  gray: 'text-gray-500 dark:text-gray-400',
  brown: 'text-orange-800 dark:text-orange-300',
  orange: 'text-orange-600 dark:text-orange-400',
  yellow: 'text-yellow-600 dark:text-yellow-300',
  green: 'text-green-600 dark:text-green-400',
  blue: 'text-blue-600 dark:text-blue-400',
  purple: 'text-purple-600 dark:text-purple-400',
  pink: 'text-pink-600 dark:text-pink-400',
  red: 'text-red-600 dark:text-red-400',

  gray_background: 'bg-gray-100 dark:bg-gray-800',
  brown_background: 'bg-orange-100 dark:bg-orange-900/50',
  orange_background: 'bg-orange-100 dark:bg-orange-900/50',
  yellow_background: 'bg-yellow-100 dark:bg-yellow-900/50',
  green_background: 'bg-green-100 dark:bg-green-900/50',
  blue_background: 'bg-blue-100 dark:bg-blue-900/50',
  purple_background: 'bg-purple-100 dark:bg-purple-900/50',
  pink_background: 'bg-pink-100 dark:bg-pink-900/50',
  red_background: 'bg-red-100 dark:bg-red-900/50',
  default_background: '',
}

export const notionColorToCss = (color: NotionColor) => {
  return colorsMap[color]
}

export const notionAnnotationsToCss = (annotations: NotionAnnotations) => {
  const classes: string[] = []

  if (annotations.strikethrough) classes.push('line-through')
  if (annotations.underline) classes.push('underline')
  if (annotations.bold) classes.push('font-bold')
  if (annotations.italic) classes.push('italic')

  classes.push(notionColorToCss(annotations.color))

  return classes
}
