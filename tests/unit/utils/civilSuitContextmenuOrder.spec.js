const fs = require('fs')
const path = require('path')

describe('civilSuit context menu source order', () => {
  it('keeps investigation protection flow menu appended at the bottom', () => {
    const filePath = path.resolve(
      __dirname,
      '../../../src/views/workbench/case/case_management/components/civilSuit.vue'
    )
    const source = fs.readFileSync(filePath, 'utf8')

    expect(source).toContain('return this.rowContextmenuList.concat([')
    expect(source).toContain('], investigationProtectionMenuList)')
  })
})
