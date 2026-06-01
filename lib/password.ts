export const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/

export const passwordRules = [
  {
    key: 'minLength',
    test: (password: string) => password.length >= 8,
  },
  {
    key: 'uppercase',
    test: (password: string) => /[A-Z]/.test(password),
  },
  {
    key: 'lowercase',
    test: (password: string) => /[a-z]/.test(password),
  },
  {
    key: 'digit',
    test: (password: string) => /\d/.test(password),
  },
  {
    key: 'special',
    test: (password: string) => /[^A-Za-z0-9]/.test(password),
  },
] as const

export type PasswordRuleKey = (typeof passwordRules)[number]['key']

export function isPasswordValid(password: string): boolean {
  return PASSWORD_REGEX.test(password)
}
