import type { PageObjectResponse, RichTextItemResponse } from '@notionhq/client'
import type { NotionBlock } from '../../src/runtime/types/collections'

export const richText = (text: string): RichTextItemResponse[] => text
  ? [{
      type: 'text',
      text: { content: text, link: null },
      annotations: { bold: false, italic: false, strikethrough: false, underline: false, code: false, color: 'default' },
      plain_text: text,
      href: null,
    }]
  : []

type Props = PageObjectResponse['properties']

export const prop = {
  title: (text: string) => ({ id: 't', type: 'title', title: richText(text) }),
  text: (text: string) => ({ id: 'r', type: 'rich_text', rich_text: richText(text) }),
  url: (url: string | null) => ({ id: 'u', type: 'url', url }),
  select: (name: string | null) => ({ id: 's', type: 'select', select: name ? { id: 'o', name, color: 'default' } : null }),
  multiSelect: (names: string[]) => ({ id: 'm', type: 'multi_select', multi_select: names.map(name => ({ id: name, name, color: 'default' })) }),
  status: (name: string) => ({ id: 'st', type: 'status', status: { id: 'o', name, color: 'default' } }),
  date: (start: string | null) => ({ id: 'd', type: 'date', date: start ? { start, end: null, time_zone: null } : null }),
  createdTime: (value: string) => ({ id: 'c', type: 'created_time', created_time: value }),
  checkbox: (value: boolean) => ({ id: 'cb', type: 'checkbox', checkbox: value }),
  number: (value: number | null) => ({ id: 'n', type: 'number', number: value }),
} satisfies Record<string, (...args: never[]) => unknown>

export function makePage(properties: Record<string, unknown>, overrides: Partial<PageObjectResponse> = {}): PageObjectResponse {
  return {
    object: 'page',
    id: '77c36c79-5d5c-463b-abbe-890071acca79',
    created_time: '2023-06-18T12:18:35.900Z',
    last_edited_time: '2026-01-14T17:36:00.000Z',
    archived: false,
    in_trash: false,
    url: 'https://www.notion.so/77c36c795d5c463babbe890071acca79',
    public_url: null,
    cover: null,
    icon: null,
    parent: { type: 'data_source_id', data_source_id: '855b82e0-9293-4034-909b-40c31660c9d2', database_id: 'db' },
    created_by: { object: 'user', id: 'u' },
    last_edited_by: { object: 'user', id: 'u' },
    properties: properties as Props,
    is_locked: false,
    ...overrides,
  } as PageObjectResponse
}

let counter = 0

export function block(type: string, content: Record<string, unknown> = {}, children?: NotionBlock[]): NotionBlock {
  counter += 1
  return {
    object: 'block',
    id: `block-${counter}`,
    type,
    [type]: content,
    has_children: !!children?.length,
    children,
    created_time: '2024-01-01T00:00:00.000Z',
    last_edited_time: '2024-01-02T00:00:00.000Z',
    archived: false,
    in_trash: false,
    parent: { type: 'page_id', page_id: 'p' },
    created_by: { object: 'user', id: 'u' },
    last_edited_by: { object: 'user', id: 'u' },
  } as unknown as NotionBlock
}

export const heading = (level: 1 | 2 | 3 | 4, text: string, children?: NotionBlock[]) =>
  block(`heading_${level}`, { rich_text: richText(text), color: 'default', is_toggleable: !!children }, children)

export const paragraph = (text: string, children?: NotionBlock[]) =>
  block('paragraph', { rich_text: richText(text), color: 'default' }, children)
