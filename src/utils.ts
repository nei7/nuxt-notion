import type { PageObjectResponse } from '@notionhq/client'

export { isFullBlock, isFullDataSource, isFullDatabase, isFullPage, isFullUser, isFullComment, isFullPageOrDataSource } from '@notionhq/client'

export const parseProperties = (properties: PageObjectResponse['properties']) => {
  return Object.entries(properties).reduce<Record<string, ParsedPropertyValue>>((previousValue, [key, property]) => {
    previousValue[key] = parseProperty(property)

    return previousValue
  }, {})
}

export type ParsedPropertyValue = number | string[] | string | undefined | null | boolean

type Property = PageObjectResponse['properties'][string]

export const parseProperty = (property: Property): ParsedPropertyValue => {
  switch (property.type) {
    case 'number':
      return property.number

    case 'url':
      return property.url

    case 'email':
      return property.email

    case 'phone_number':
      return property.phone_number

    case 'checkbox':
      return property.checkbox

    case 'select':
      return property.select?.name

    case 'multi_select':
      return property.multi_select.map(option => option.name)

    case 'rich_text':
      return property.rich_text.map(t => t.plain_text).join('')

    case 'title':
      return property.title.map(t => t.plain_text).join('')

    case 'date':
      return property.date?.start

    case 'formula':
      if (property.formula.type === 'string') return property.formula.string
      if (property.formula.type === 'number') return property.formula.number
      if (property.formula.type === 'boolean') return property.formula.boolean
      if (property.formula.type === 'date') return property.formula.date?.start
      return null

    case 'relation':
      return property.relation.map(r => r.id)

    case 'people':
      return property.people.map(p => p.id)

    case 'files':
      return property.files.map(f => f.name)

    default:
      return null
  }
}
