import { getInvestigationProtectionFlowRoute } from '@/utils/investigationProtection'

describe('investigationProtection utils', () => {
  it('builds v1 investigation protection route with keyword from agentNum', () => {
    expect(getInvestigationProtectionFlowRoute({ agentNum: 'ABC-123' })).toEqual({
      path: '/workbench/technological_process/investigationProtection',
      query: {
        keyword: 'ABC-123'
      }
    })
  })

  it('uses empty keyword when row has no agentNum', () => {
    expect(getInvestigationProtectionFlowRoute({})).toEqual({
      path: '/workbench/technological_process/investigationProtection',
      query: {
        keyword: ''
      }
    })
  })
})
