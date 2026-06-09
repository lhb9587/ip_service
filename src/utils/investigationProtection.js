export function getInvestigationProtectionFlowRoute(row = {}) {
  return {
    path: '/workbench/technological_process/investigationProtection',
    query: {
      keyword: row.agentNum || ''
    }
  }
}
