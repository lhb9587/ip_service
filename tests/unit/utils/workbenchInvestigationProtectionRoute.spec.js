const fs = require('fs')
const path = require('path')

describe('workbench investigation protection routes', () => {
  it('keeps the kebab-case technological process route hidden', () => {
    const filePath = path.resolve(
      __dirname,
      '../../../src/router/modules/workbench.js'
    )
    const source = fs.readFileSync(filePath, 'utf8')
    const routeSnippet = `{
          path: 'investigation-protection',
          component: () => import('@/views/workbench/investigation_protection'),
          name: 'investigation-protection',
          meta: {
            title: '调查保护',
            icon: '任务'
          },
          hidden: true
        }`

    expect(source).toContain(routeSnippet)
  })
})
