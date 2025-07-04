import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import CreateAssignorModal from '@/app/assignors/_components/create-assignor-modal'

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    refresh: jest.fn(),
  }),
}))

jest.mock('@/services/assignors.service', () => ({
  assignorsService: {
    create: jest.fn().mockResolvedValue({}),
  },
}))

jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}))

describe('CreateAssignorModal', () => {
  const user = userEvent.setup()

  it('should render the open modal button', () => {
    render(<CreateAssignorModal />)
    
    expect(screen.getByRole('button', { name: /add assignor/i })).toBeInTheDocument()
  })

  it('should open the modal when the button is clicked', async () => {
    render(<CreateAssignorModal />)
    
    const openBtn = screen.getByRole('button', { name: /add assignor/i })
    await user.click(openBtn)
    
    const elements = screen.getAllByText(/create assignor/i)
    expect(elements.length).toBeGreaterThan(0)
  })
}) 