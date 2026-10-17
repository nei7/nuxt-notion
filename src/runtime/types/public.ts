/**
 * Public type entry (`@nei7/nuxt-notion/types`).
 *
 * Explicit named re-exports keep every interface declared exactly once, so a
 * `declare module '@nei7/nuxt-notion/types'` augmentation of `NotionCollections`
 * reaches the composables and server utilities too.
 */
export type {
  NotionBlock,
  NotionCodeBlock,
  NotionHeading,
  NotionReadingTime,
  NotionIcon,
  NotionCollectionItem,
  NotionCollectionTag,
  NotionCollectionResponse,
  NotionCollectionNeighbour,
  NotionCollectionItemResponse,
  NotionCollectionQuery,
  NotionCollections,
  NotionCollectionName,
  NotionCollectionProps,
  CollectionPublishedFilter,
  CollectionPropertyMap,
  ResolvedPropertyMap,
  CollectionConfig,
  ResolvedCollectionConfig,
} from './collections'

export type {
  NotionColor,
  AnyNotionBlock,
  NotionAnnotations,
  NotionBlockOf,
  NotionListType,
  NotionListBlock,
  NotionHeadingBlock,
  NotionEmbed,
} from './notion'

export type {
  LinkMetadataSuccessResponse,
  LinkMetadataErrorResponse,
  LinkMetadataResponse,
} from './index'

export type {
  ModuleOptions,
  NotionDarkMode,
  NuxtNotionRuntimeConfig,
  NuxtNotionPublicRuntimeConfig,
} from './module'

export type { ParsedPropertyValue, DateResponse } from '../utils/properties'
export type { InvalidationTarget, WebhookEventPayload } from '../utils/webhook'
export type { NotionLinkResolver, NotionLinkTarget, NotionRendererContext } from '../utils/renderer-context'
export type { NotionFileKind } from '../utils/files'
