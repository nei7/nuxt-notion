import type { BlockObjectResponse, BulletedListItemBlockObjectResponse, NumberedListItemBlockObjectResponse, PartialBlockObjectResponse, RichTextItemResponse, ToDoBlockObjectResponse } from '@notionhq/client'

export type NotionColor = RichTextItemResponse['annotations']['color']

export type AnyNotionBlock = BlockObjectResponse | PartialBlockObjectResponse

export type NotionAnnotations = RichTextItemResponse['annotations']

export type NotionListBlock = BulletedListItemBlockObjectResponse | NumberedListItemBlockObjectResponse | ToDoBlockObjectResponse
