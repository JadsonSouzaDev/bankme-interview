import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import SignupForm from '@/app/signup/_components/signup-form'

// Mock of Next.js router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}))

// Mock of AuthService
jest.mock('@/services/auth.service', () => ({
  AuthService: jest.fn().mockImplementation(() => ({
    signup: jest.fn().mockResolvedValue({ login: 'testuser' }),
  })),
}))

// Mock of toast
jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}))

const user = userEvent.setup()

describe('SignupForm', () => {
  it('should render the signup form', () => {
    render(<SignupForm />)
    
    expect(screen.getByLabelText(/login/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /signup/i })).toBeInTheDocument()
  })

  it('should show validation errors for empty fields', async () => {
    render(<SignupForm />)
    
    const submitButton = screen.getByRole('button', { name: /signup/i })
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText(/login is required/i)).toBeInTheDocument()
      expect(screen.getByText(/password is required/i)).toBeInTheDocument()
    })
  })

  it('should show error for short login', async () => {
    render(<SignupForm />)
    
    const loginInput = screen.getByLabelText(/login/i)
    await user.click(loginInput)
    await user.type(loginInput, 'ab')
    await user.tab()
    
    await waitFor(() => {
      expect(screen.getByText(/login must be at least 3 characters/i)).toBeInTheDocument()
    })
  })

  it('should show error for short password', async () => {
    render(<SignupForm />)
    
    const passwordInput = screen.getByLabelText(/password/i)
    await user.click(passwordInput)
    await user.type(passwordInput, '123')
    await user.tab()
    
    await waitFor(() => {
      expect(screen.getByText(/password must be at least 6 characters/i)).toBeInTheDocument()
    })
  })

  it('should have a link to login', () => {
    render(<SignupForm />)
    
    const loginLink = screen.getByRole('link', { name: /login/i })
    expect(loginLink).toBeInTheDocument()
    expect(loginLink).toHaveAttribute('href', '/login')
  })
}) 