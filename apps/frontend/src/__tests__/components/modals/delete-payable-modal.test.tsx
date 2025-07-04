import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import DeletePayableModal from '@/app/payables/_components/delete-payable-modal'

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    refresh: jest.fn(),
  }),
}))

jest.mock('@/services/payable.service', () => ({
  payableService: {
    delete: jest.fn().mockResolvedValue({}),
  },
}))

jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}))

describe('DeletePayableModal', () => {
  const user = userEvent.setup()
  const payable = {
    id: '1',
    value: 1000,
    emissionDate: new Date(),
    assignorId: '1',
  }

  it('should render the delete button', () => {
    render(<DeletePayableModal payable={payable} />)
    
    const deleteTriggers = screen.getAllByText(/delete/i)
    expect(deleteTriggers.length).toBeGreaterThan(0)
  })

  it('should open the modal when the button is clicked', async () => {
    render(<DeletePayableModal payable={payable} />)
    
    const deleteTriggers = screen.getAllByText(/delete/i)
    await user.click(deleteTriggers[0])
    const elements = screen.getAllByText(/delete payable/i)
    expect(elements.length).toBeGreaterThan(0)
  })
}) 