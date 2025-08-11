import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import DashboardCard from '~/components/dashboard/DashboardCard.vue'

describe('DashboardCard', () => {
  it('renders correctly with props', () => {
    const wrapper = mount(DashboardCard, {
      props: {
        title: 'Test Title',
        value: '123',
        change: '+10%',
        icon: 'pi pi-users',
        color: 'blue'
      },
      global: {
        stubs: {
          Card: {
            template: '<div><slot name="content" /></div>'
          },
          Badge: {
            template: '<span>{{ value }}</span>',
            props: ['value', 'severity']
          }
        }
      }
    })

    expect(wrapper.text()).toContain('Test Title')
    expect(wrapper.text()).toContain('123')
    expect(wrapper.text()).toContain('+10%')
  })

  it('computes correct color class', () => {
    const wrapper = mount(DashboardCard, {
      props: {
        title: 'Test',
        value: '100',
        change: '+5%',
        icon: 'pi pi-test',
        color: 'green'
      },
      global: {
        stubs: {
          Card: { template: '<div><slot name="content" /></div>' },
          Badge: { template: '<span />' }
        }
      }
    })

    const colorDiv = wrapper.find('.bg-green-500')
    expect(colorDiv.exists()).toBe(true)
  })

  it('computes correct change severity', async () => {
    const wrapper = mount(DashboardCard, {
      props: {
        title: 'Test',
        value: '100',
        change: '+5%',
        icon: 'pi pi-test',
        color: 'blue'
      },
      global: {
        stubs: {
          Card: { template: '<div><slot name="content" /></div>' },
          Badge: {
            template: '<span>{{ severity }}</span>',
            props: ['value', 'severity']
          }
        }
      }
    })

    expect(wrapper.text()).toContain('success')

    await wrapper.setProps({ change: '-5%' })
    expect(wrapper.text()).toContain('danger')
  })
})