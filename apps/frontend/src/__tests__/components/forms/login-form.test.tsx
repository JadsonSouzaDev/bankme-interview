import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import LoginForm from '@/app/login/_components/login-form'

// Mock do Next.js router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    refresh: jest.fn(),
  }),
}))

// Mock do AuthService
jest.mock('@/services/auth.service', () => ({
  AuthService: jest.fn().mockImplementation(() => ({
    login: jest.fn(),
  })),
}))

// Mock do toast
jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}))

const user = userEvent.setup()

describe('LoginForm', () => {
  it('should render login form', () => {
    render(<LoginForm />)
    
    expect(screen.getByLabelText(/login/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument()
  })

  it('should show validation errors for empty form submission', async () => {
    render(<LoginForm />)
    
    const submitButton = screen.getByRole('button', { name: /login/i })
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText(/login is required/i)).toBeInTheDocument()
      expect(screen.getByText(/password is required/i)).toBeInTheDocument()
    })
  })

  it('should show validation error for short login', async () => {
    render(<LoginForm />)
    
    const loginInput = screen.getByLabelText(/login/i)
    await user.click(loginInput)
    await user.type(loginInput, 'ab')
    await user.tab() // Trigger blur event
    
    await waitFor(() => {
      expect(screen.getByText(/login must be at least 3 characters/i)).toBeInTheDocument()
    })
  })

  it('should show validation error for short password', async () => {
    render(<LoginForm />)
    
    const passwordInput = screen.getByLabelText(/password/i)
    await user.click(passwordInput)
    await user.type(passwordInput, '123')
    await user.tab() // Trigger blur event
    
    await waitFor(() => {
      expect(screen.getByText(/password must be at least 6 characters/i)).toBeInTheDocument()
    })
  })

  it('should have link to signup page', () => {
    render(<LoginForm />)
    
    const signupLink = screen.getByRole('link', { name: /register/i })
    expect(signupLink).toBeInTheDocument()
    expect(signupLink).toHaveAttribute('href', '/signup')
  })
}) 