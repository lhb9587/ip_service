import { shallowMount } from '@vue/test-utils'
import InvestigationProtection from '@/views/workbench/investigation_protection/index.vue'
import { getInfo } from '@/api/user'

jest.mock('@/api/user', () => ({
  getInfo: jest.fn()
}))

jest.mock('element-ui', () => ({
  Loading: {
    service: jest.fn(() => ({
      close: jest.fn()
    }))
  }
}))

describe('InvestigationProtection.vue', () => {
  beforeEach(() => {
    getInfo.mockReset()
  })

  function mountComponent() {
    return shallowMount(InvestigationProtection, {
      mocks: {
        $route: {
          query: {
            invtId: '42',
            layout: 'no',
            todoList: '1'
          }
        },
        $router: {
          push: jest.fn(),
          replace: jest.fn()
        }
      }
    })
  }

  it('requests user info when iframe reports expired auth', () => {
    const wrapper = mountComponent()

    wrapper.vm.handleIframeMessage({ data: { code: '-200' } })

    expect(getInfo).toHaveBeenCalled()
  })

  it('passes keyword query to v2 iframe url', () => {
    const wrapper = shallowMount(InvestigationProtection, {
      mocks: {
        $route: {
          query: {
            keyword: 'ABC-123',
            layout: 'no'
          }
        },
        $router: {
          push: jest.fn(),
          replace: jest.fn()
        }
      }
    })

    expect(wrapper.vm.url).toContain('/v2/management/investigation-protection?')
    expect(wrapper.vm.url).toContain('keyword=ABC-123')
    expect(wrapper.vm.url).toContain('layout=no')
  })

  it('consumes keyword from parent route after passing it to iframe', () => {
    const replace = jest.fn()
    shallowMount(InvestigationProtection, {
      mocks: {
        $route: {
          path: '/workbench/technological_process/investigationProtection',
          query: {
            keyword: 'ABC-123',
            layout: 'no'
          }
        },
        $router: {
          push: jest.fn(),
          replace
        }
      }
    })

    expect(replace).toHaveBeenCalledWith({
      path: '/workbench/technological_process/investigationProtection',
      query: {
        layout: 'no'
      }
    })
  })

  it('returns to investigation protection todo tab when iframe closes', () => {
    const wrapper = mountComponent()

    wrapper.vm.handleIframeMessage({ data: { code: '2' } })

    expect(wrapper.vm.$router.push).toHaveBeenCalledWith('/workbench/toDoTask?name=14')
  })

  it('returns to investigation protection todo tab when iframe cancels', () => {
    const wrapper = mountComponent()

    wrapper.vm.handleIframeMessage({ data: { code: 'investigation-protection-cancel' } })

    expect(wrapper.vm.$router.push).toHaveBeenCalledWith('/workbench/toDoTask?name=14')
  })
})
