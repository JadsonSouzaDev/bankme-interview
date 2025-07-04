import '@testing-library/jest-dom'
import { jest } from '@jest/globals'

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    refresh: jest.fn(),
  }),
}))

jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
    warning: jest.fn(),
    info: jest.fn(),
  },
}))

global.localStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
})

jest.mock('next/link', () => {
  const MockLink = ({ children, href, ...props }) => {
    return <a href={href} {...props}>{children}</a>
  }
  MockLink.displayName = 'MockLink'
  return MockLink
})

jest.mock('@/components/ui', () => {
  const Button = ({ asChild, ...props }) => {
    if (asChild) {
      return props.children
    }
    return <button {...props} />
  }
  Button.displayName = 'Button'
  
  const Input = (props) => <input {...props} />
  Input.displayName = 'Input'
  
  const Label = (props) => <label {...props} />
  Label.displayName = 'Label'
  
  const Dialog = (props) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { onOpenChange, ...rest } = props
    return <div {...rest} />
  }
  Dialog.displayName = 'Dialog'
  
  const DialogContent = (props) => <div {...props} />
  DialogContent.displayName = 'DialogContent'
  
  const DialogDescription = (props) => <div {...props} />
  DialogDescription.displayName = 'DialogDescription'
  
  const DialogHeader = (props) => <div {...props} />
  DialogHeader.displayName = 'DialogHeader'
  
  const DialogTitle = (props) => <div {...props} />
  DialogTitle.displayName = 'DialogTitle'
  
  const DialogTrigger = ({ asChild, children, ...props }) => {
    if (asChild) {
      return children
    }
    return <button {...props}>{children}</button>
  }
  DialogTrigger.displayName = 'DialogTrigger'
  
  const PageCard = (props) => <div {...props} />
  PageCard.displayName = 'PageCard'
  
  const Table = (props) => <table {...props} />
  Table.displayName = 'Table'
  
  const TableBody = (props) => <tbody {...props} />
  TableBody.displayName = 'TableBody'
  
  const TableCaption = (props) => <caption {...props} />
  TableCaption.displayName = 'TableCaption'
  
  const TableCell = (props) => <td {...props} />
  TableCell.displayName = 'TableCell'
  
  const TableHead = (props) => <th {...props} />
  TableHead.displayName = 'TableHead'
  
  const TableHeader = (props) => <thead {...props} />
  TableHeader.displayName = 'TableHeader'
  
  const TableRow = (props) => <tr {...props} />
  TableRow.displayName = 'TableRow'
  
  return {
    Button,
    Input,
    Label,
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    PageCard,
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  }
}) 