import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import EditPayableModal from '@/app/payables/_components/edit-payable-modal'

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    refresh: jest.fn(),
  }),
}))

jest.mock('@/services/payable.service', () => ({
  payableService: {
    update: jest.fn().mockResolvedValue({}),
  },
}))

jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}))

describe('EditPayableModal', () => {
  const user = userEvent.setup()
  const payable = {
    id: '1',
    value: 1000,
    emissionDate: new Date(),
    assignorId: '1',
  }

  it('should render the edit button', () => {
    render(<EditPayableModal payable={payable} />)
    
    const editTriggers = screen.getAllByText(/edit/i)
    expect(editTriggers.length).toBeGreaterThan(0)
  })

  it('should open the modal when the button is clicked', async () => {
    render(<EditPayableModal payable={payable} />)
    
    const editTriggers = screen.getAllByText(/edit/i)
    await user.click(editTriggers[0])
    const elements = screen.getAllByText(/edit payable/i)
    expect(elements.length).toBeGreaterThan(0)
  })
}) 