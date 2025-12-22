export type LinkMetadataSuccessResponse = {
  success: true
  title: string
  description?: string
  image?: string
  icon?: string
  url: string
}

export type LinkMetadataErrorResponse = {
  success: false
  title: string
  url: string

}

export type LinkMetadataResponse = LinkMetadataErrorResponse | LinkMetadataSuccessResponse
