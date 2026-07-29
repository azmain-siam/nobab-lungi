// Re-export auth actions from domain feature location
export {
  loginAction,
  registerAction,
  logoutAction,
  forgotPasswordAction,
  resetPasswordAction,
} from '@/features/auth/actions/auth-actions';
export type { AuthActionResult } from '@/features/auth/actions/auth-actions';
