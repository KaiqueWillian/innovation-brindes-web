'use client';

import { Button } from '@/components/ui/Button';
import { Checkbox } from '@/components/ui/Checkbox';
import { Input } from '@/components/ui/Input';
import { Text } from '@/components/ui/Typography';
import { POST_LOGIN_SUCCESS_TOAST_KEY } from '@/lib/auth/constants';
import { login } from '@/services/api/auth';
import { ApiClientError } from '@/services/api/types';
import { useAuthStore } from '@/store/auth.store';
import { useMutation } from '@tanstack/react-query';
import { Eye, EyeOff, Lock, Mail } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';
import { toast } from 'sonner';

export function LoginForm() {
  const router = useRouter();
  const loginSuccess = useAuthStore((state) => state.loginSuccess);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const mutation = useMutation({
    mutationFn: login,
    onSuccess: (response) => {
      loginSuccess({
        token: response.accessToken,
        remember: rememberMe,
        user: {
          name: response.user?.name,
          username: email
        }
      });

      if (typeof window !== 'undefined') {
        sessionStorage.setItem(POST_LOGIN_SUCCESS_TOAST_KEY, '1');
      }

      router.replace('/produtos');
      router.refresh();
    },
    onError: (error) => {
      if (error instanceof ApiClientError) {
        toast.error(error.message);
        return;
      }

      toast.error('Falha ao realizar login. Tente novamente.');
    }
  });

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!email.trim() || !password.trim()) {
      toast.error('Preencha e-mail e senha para continuar.');
      return;
    }

    mutation.mutate({
      email: email.trim(),
      password
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4" autoComplete="off">
      <Input
        id="email"
        name="login_email_manual"
        label="E-mail"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        placeholder="Digite seu e-mail"
        autoComplete="off"
        className="rounded-[6px] border-slate-200 shadow-sm transition focus-visible:ring-brand-300"
        startAdornment={<Mail className="h-4 w-4" aria-hidden="true" />}
      />

      <Input
        id="password"
        name="login_password_manual"
        label="Senha"
        type={showPassword ? 'text' : 'password'}
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        placeholder="Digite sua senha"
        autoComplete="new-password"
        className="rounded-[6px] border-slate-200 shadow-sm transition focus-visible:ring-brand-300"
        startAdornment={<Lock className="h-4 w-4" aria-hidden="true" />}
        endAdornment={
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => setShowPassword((value) => !value)}
            aria-label={showPassword ? 'Ocultar senha' : 'Exibir senha'}
            aria-pressed={showPassword}
            aria-controls="password"
            className="h-8 w-8 rounded-[6px] border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 focus-visible:ring-brand-300"
          >
            {showPassword ? <EyeOff className="h-4 w-4" aria-hidden="true" /> : <Eye className="h-4 w-4" aria-hidden="true" />}
          </Button>
        }
      />

      <div className="flex items-center justify-between gap-2">
        <Checkbox
          checked={rememberMe}
          onCheckedChange={setRememberMe}
          label="Manter logado"
          id="remember-me"
          labelClassName="text-sm text-slate-600"
        />

        <Button type="button" variant="link" className="w-fit p-0 text-sm font-medium">
          Esqueceu a senha?
        </Button>
      </div>

      <Button
        fullWidth
        type="submit"
        isLoading={mutation.isPending}
        className="!rounded-[6px] !border-brand-600 !bg-brand-600 !text-white hover:!bg-brand-700 focus-visible:!ring-brand-400"
      >
        Entrar
      </Button>


      <div className="flex items-center justify-center gap-1">
        <Text tone="muted" className="text-center text-sm">
          Ainda nao tem uma conta?
        </Text>

        <Button type="button" variant="link" className="w-fit p-0 text-sm font-medium">
          Cadastre-se
        </Button>
      </div>
    </form>
  );
}
