import { createContentLoader } from 'vitepress'

export default createContentLoader('**/*.md', {
  transform(rawData) {
    const categories = new Set<string>()

    rawData.forEach(page => {
      const cat = page.frontmatter?.category
      if (cat) categories.add(cat)
    })

    return Array.from(categories).map(category => ({
      params: { category },
    }))
  },
})
