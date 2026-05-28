import { createContentLoader } from 'vitepress'

export default createContentLoader('**/*.md', {
  transform(rawData) {
    const tags = new Set<string>()

    rawData.forEach(page => {
      const pageTags = page.frontmatter?.tags
      if (Array.isArray(pageTags)) {
        pageTags.forEach(tag => tags.add(tag))
      }
    })

    return Array.from(tags).map(tag => ({
      params: {
        tag,
      },
    }))
  },
})
