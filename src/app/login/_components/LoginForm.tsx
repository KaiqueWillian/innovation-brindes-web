'use client';

import { POST_LOGIN_SUCCESS_TOAST_KEY } from '@/lib/auth/constants';
import { setAuthToken } from '@/lib/auth/cookies';
import { saveAuthSession } from '@/lib/auth/storage';
import { login } from '@/services/api/auth';
import { ApiClientError } from '@/services/api/types';
import { Eye, EyeOff, Lock, Mail } from 'lucide-react';
import { ChangeEvent, FormEvent, useState } from 'react';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const inputClassName =
    'flex h-10 w-full rounded-[6px] border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm transition placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-300 disabled:cursor-not-allowed disabled:opacity-50';
  const labelClassName = 'text-sm font-medium leading-none text-slate-800';
  const linkButtonClassName =
    'h-auto w-fit border-0 bg-transparent p-0 text-sm font-medium text-brand-700 underline-offset-2 hover:text-brand-800 hover:underline';

  function handleEmailChange(event: ChangeEvent<HTMLInputElement>) {
    setEmail(event.target.value);

    if (submitError) {
      setSubmitError(null);
    }
  }

  function handlePasswordChange(event: ChangeEvent<HTMLInputElement>) {
    setPassword(event.target.value);

    if (submitError) {
      setSubmitError(null);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!email.trim() || !password.trim()) {
      setSubmitError('Preencha e-mail e senha para continuar.');
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const normalizedEmail = email.trim();
      const response = await login({
        email: normalizedEmail,
        password
      });

      setAuthToken(response.accessToken, rememberMe);
      saveAuthSession(
        {
          token: response.accessToken,
          user: {
            name: response.user?.name,
            username: normalizedEmail
          }
        },
        rememberMe
      );

      if (typeof window !== 'undefined') {
        sessionStorage.setItem(POST_LOGIN_SUCCESS_TOAST_KEY, '1');
        window.location.replace('/produtos');
      }
    } catch (error) {
      if (error instanceof ApiClientError) {
        setSubmitError(error.message);
      } else {
        setSubmitError('Falha ao realizar login. Tente novamente.');
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4" autoComplete="off">
      {submitError ? (
        <p role="alert" className="rounded-[6px] border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {submitError}
        </p>
      ) : null}

      <div className="flex w-full flex-col gap-2">
        <label htmlFor="email" className={labelClassName}>
          E-mail
        </label>

        <div className="relative">
          <input
            id="email"
            name="login_email_manual"
            value={email}
            onChange={handleEmailChange}
            placeholder="Digite seu e-mail"
            autoComplete="off"
            className={`${inputClassName} pl-10`}
          />

          <div className="absolute inset-y-0 left-3 flex items-center text-slate-500">
            <Mail className="h-4 w-4" aria-hidden="true" />
          </div>
        </div>
      </div>

      <div className="flex w-full flex-col gap-2">
        <label htmlFor="password" className={labelClassName}>
          Senha
        </label>

        <div className="relative">
          <input
            id="password"
            name="login_password_manual"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={handlePasswordChange}
            placeholder="Digite sua senha"
            autoComplete="new-password"
            className={`${inputClassName} pl-10 pr-10`}
          />

          <div className="absolute inset-y-0 left-3 flex items-center text-slate-500">
            <Lock className="h-4 w-4" aria-hidden="true" />
          </div>

          <div className="absolute inset-y-0 right-2 flex items-center text-slate-500">
            <button
              type="button"
              onClick={() => setShowPassword((value) => !value)}
              aria-label={showPassword ? 'Ocultar senha' : 'Exibir senha'}
              aria-pressed={showPassword}
              aria-controls="password"
              className="flex h-8 w-8 items-center justify-center rounded-[6px] border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-300"
            >
              {showPassword ? <EyeOff className="h-4 w-4" aria-hidden="true" /> : <Eye className="h-4 w-4" aria-hidden="true" />}
            </button>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between gap-2">
        <label htmlFor="remember-me" className="inline-flex cursor-pointer items-center gap-2 text-sm text-slate-600">
          <input
            id="remember-me"
            type="checkbox"
            checked={rememberMe}
            onChange={(event) => setRememberMe(event.target.checked)}
            className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-300"
          />
          <span>Manter logado</span>
        </label>

        <button type="button" className={linkButtonClassName}>
          Esqueceu a senha?
        </button>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex h-10 w-full items-center justify-center rounded-[6px] border border-brand-600 bg-brand-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 disabled:pointer-events-none disabled:opacity-60"
      >
        {isSubmitting ? 'Carregando...' : 'Entrar'}
      </button>

      <div className="flex items-center justify-center gap-1">
        <p className="text-center text-sm leading-relaxed text-slate-600">Ainda nao tem uma conta?</p>

        <button type="button" className={linkButtonClassName}>
          Cadastre-se
        </button>
      </div>
    </form>
  );
}
