import type {
  Session,
  User,
} from '@supabase/supabase-js';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginValidationErrors {
  email?: string;
  password?: string;
}

export interface SignUpCredentials {
  email: string;
  password: string;
}

export interface SignUpValidationErrors {
  email?: string;
  password?: string;
}

export interface ResetPasswordInput {
  email: string;
}

export interface ResetPasswordValidationErrors {
  email?: string;
}

export type AuthErrorCode =
  | 'INVALID_CREDENTIALS'
  | 'NETWORK_ERROR'
  | 'UNEXPECTED_ERROR';

export interface AuthServiceError {
  code: AuthErrorCode;
  message: string;
}

export interface AuthSuccessResult {
  session: Session;
  user: User;
}

export type LoginResult =
  | {
      success: true;
      data: AuthSuccessResult;
    }
  | {
      success: false;
      error: AuthServiceError;
    };

export type SignUpResult =
  | {
      success: true;
      message: string;
    }
  | {
      success: false;
      error: AuthServiceError;
    };

export type ResetPasswordResult =
  | {
      success: true;
      message: string;
    }
  | {
      success: false;
      error: AuthServiceError;
    };
