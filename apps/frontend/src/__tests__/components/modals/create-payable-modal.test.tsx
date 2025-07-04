import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import CreatePayableModal from '@/app/payables/_components/create-payable-modal'

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    refresh: jest.fn(),
  }),
}))

jest.mock('@/services/payable.service', () => ({
  payableService: {
    create: jest.fn().mockResolvedValue({}),
  },
}))

jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}))

describe('CreatePayableModal', () => {
  const user = userEvent.setup()

  it('should render the open modal button', () => {
    render(<CreatePayableModal />)
    
    expect(screen.getByRole('button', { name: /add payable/i })).toBeInTheDocument()
  })

  it('should open the modal when the button is clicked', async () => {
    render(<CreatePayableModal />)
    
    const openBtn = screen.getByRole('button', { name: /add payable/i })
    await user.click(openBtn)
    
    const elements = screen.getAllByText(/create payable/i)
    expect(elements.length).toBeGreaterThan(0)
  })
}) 