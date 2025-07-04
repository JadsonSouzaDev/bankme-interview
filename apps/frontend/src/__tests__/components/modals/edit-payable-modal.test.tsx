import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

// Mock of @bankme/shared
jest.mock('@bankme/shared', () => ({
  AssignorDto: {
    id: 'string',
    name: 'string',
    email: 'string',
    document: 'string',
    phone: 'string',
  },
}))

// Mock of next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    refresh: jest.fn(),
  }),
}))

// Mock of services
jest.mock('@/services/payable.service', () => ({
  payableService: {
    update: jest.fn().mockResolvedValue({}),
  },
}))

jest.mock('@/services/assignors.service', () => ({
  assignorsService: {
    getAll: jest.fn().mockResolvedValue({
      assignors: [
        {
          id: '1',
          name: 'Test Assignor',
          email: 'test@example.com',
          document: '12345678901',
          phone: '11999999999',
        },
      ],
    }),
  },
}))

// Mock of sonner
jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}))

// Mock of all UI components
jest.mock('@/components/ui', () => ({
  Button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
  Input: ({ ...props }: any) => <input {...props} />,
  Label: ({ children, ...props }: any) => <label {...props}>{children}</label>,
  Dialog: ({ children, open, onOpenChange }: any) => (
    <div data-testid="dialog" data-open={open}>
      {children}
    </div>
  ),
  DialogContent: ({ children }: any) => <div data-testid="dialog-content">{children}</div>,
  DialogDescription: ({ children }: any) => <div data-testid="dialog-description">{children}</div>,
  DialogHeader: ({ children }: any) => <div data-testid="dialog-header">{children}</div>,
  DialogTitle: ({ children }: any) => <div data-testid="dialog-title">{children}</div>,
  DialogTrigger: ({ children, asChild }: any) => {
    if (asChild) {
      return children
    }
    return <button data-testid="dialog-trigger">{children}</button>
  },
  CurrencyInput: ({ id, value, onChange, error, className, ...props }: any) => (
    <input
      id={id}
      value={value}
      onChange={(e) => onChange && onChange(parseFloat(e.target.value) || 0)}
      className={className}
      data-testid="currency-input"
      {...props}
    />
  ),
}))

// Mock of react-number-format
jest.mock('react-number-format', () => ({
  NumericFormat: ({ customInput: CustomInput, ...props }: any) => {
    const InputComponent = CustomInput || 'input'
    return <InputComponent {...props} />
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

  it('should render the edit button', async () => {
    const { default: EditPayableModal } = await import('@/app/payables/_components/edit-payable-modal')
    render(<EditPayableModal payable={payable} />)
    const editTriggers = screen.getAllByText(/edit/i)
    expect(editTriggers.length).toBeGreaterThan(0)
  })

  it('should open the modal when the button is clicked', async () => {
    const { default: EditPayableModal } = await import('@/app/payables/_components/edit-payable-modal')
    render(<EditPayableModal payable={payable} />)
    const editTriggers = screen.getAllByText(/edit/i)
    await user.click(editTriggers[0])
    const elements = screen.getAllByText(/edit payable/i)
    expect(elements.length).toBeGreaterThan(0)
  })
}) 