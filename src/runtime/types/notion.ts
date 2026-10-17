import type {
  BlockObjectResponse,
  PartialBlockObjectResponse,
  RichTextItemResponse,
  EmbedBlockObjectResponse,
  VideoBlockObjectResponse,
} from '@notionhq/client'
import type { NotionBlock } from './collections'

export type NotionColor = RichTextItemResponse['annotations']['color']

export type AnyNotionBlock = BlockObjectResponse | PartialBlockObjectResponse

export type NotionAnnotations = RichTextItemResponse['annotations']

export type NotionBlockOf<T extends NotionBlock['type']> = Extract<NotionBlock, { type: T }>

export type NotionListType = 'bulleted_list_item' | 'numbered_list_item' | 'to_do'

export type NotionListBlock = NotionBlockOf<NotionListType>

export type NotionHeadingBlock = NotionBlockOf<'heading_1' | 'heading_2' | 'heading_3' | 'heading_4'>

export type NotionEmbed = EmbedBlockObjectResponse | VideoBlockObjectResponse & { video: { type: 'external' } }
