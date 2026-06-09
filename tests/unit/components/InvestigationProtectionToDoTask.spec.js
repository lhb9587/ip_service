import { shallowMount } from '@vue/test-utils'
import InvestigationProtectionToDoTask from '@/views/workbench/toDoTasks/components/InvestigationProtectionToDoTask.vue'
import { getInvestTaskList } from '@/api/dashboard'

jest.mock('@/api/dashboard', () => ({
  getInvestTaskList: jest.fn()
}))

jest.mock('@/components/Pagination', () => ({
  name: 'Pagination',
  render: h => h('div')
}))

describe('InvestigationProtectionToDoTask.vue', () => {
  beforeEach(() => {
    getInvestTaskList.mockReset()
    getInvestTaskList.mockResolvedValue({
      data: [{ invtId: 42, invtNo: 'INV-001' }],
      total: 7
    })
  })

  it('loads todo investigation tasks with pagination and todoList flag', async() => {
    const wrapper = shallowMount(InvestigationProtectionToDoTask, {
      mocks: {
        $route: { name: 'toDoTasksChildren' },
        $router: { push: jest.fn() }
      },
      stubs: {
        'el-table': true,
        'el-table-column': true,
        'el-button': true
      }
    })

    await wrapper.vm.$nextTick()
    await Promise.resolve()

    expect(getInvestTaskList).toHaveBeenCalledWith({
      page: 1,
      pageSize: 10,
      todoList: 1
    })
    expect(wrapper.vm.taskList).toEqual([{ invtId: 42, invtNo: 'INV-001' }])
    expect(wrapper.vm.total).toBe(7)
  })

  it('navigates to investigation protection detail with invtId', () => {
    const push = jest.fn()
    const wrapper = shallowMount(InvestigationProtectionToDoTask, {
      mocks: {
        $route: { name: 'toDoTasksChildren' },
        $router: { push }
      },
      stubs: {
        'el-table': true,
        'el-table-column': true,
        'el-button': true
      }
    })

    wrapper.vm.jumpInvestigationProtectionDetail({ invtId: 42 })

    expect(push).toHaveBeenCalledWith('/workbench/investigation-protection?invtId=42&layout=no&todoList=1')
  })
})
