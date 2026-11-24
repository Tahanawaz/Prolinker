import { ArrowLeft, ArrowRight, HardHat, House } from 'lucide-react';
import { Link } from 'react-router-dom';

import { Logo } from '@/components/marketing/Logo';
import { useContent } from '@/content';

interface AuthPlaceholderPageProps {
  mode: 'login' | 'signup';
}

/** Temporary account entry point until authentication is connected. */
export function AuthPlaceholderPage({ mode }: AuthPlaceholderPageProps) {
  const { auth } = useContent();
  const options = [
    { ...auth.customer, Icon: House, to: '/services' },
    { ...auth.worker, Icon: HardHat, to: '/for-workers' },
  ];

  return (
    <section className="relative isolate flex min-h-dvh items-center overflow-hidden bg-brand-950 py-32">
      <div aria-hidden="true" className="bg-grid-dark mask-fade-b absolute inset-0 -z-10" />
      <div
        aria-hidden="true"
        className="absolute -top-40 start-1/2 -z-10 h-[30rem] w-[50rem] -translate-x-1/2 rounded-full bg-brand-500/25 blur-3xl rtl:translate-x-1/2"
      />
      <div className="container max-w-2xl">
        <div className="animate-fade-up rounded-4xl bg-white p-8 shadow-lift sm:p-12">
          <Logo />
          <h1 className="mt-8 text-3xl font-extrabold text-ink">
            {mode === 'login' ? auth.loginTitle : auth.signupTitle}
          </h1>
          <p className="mt-3 text-ink-muted">{auth.body}</p>
          <ul className="mt-8 grid gap-4 sm:grid-cols-2">
            {options.map(({ title, body, Icon, to }) => (
              <li key={title}>
                <Link
                  to={to}
                  className="group flex h-full flex-col rounded-3xl border border-slate-200 p-6 transition hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-lift"
                >
                  <span className="grid h-12 w-12 place-items-center rounded-2xl bg-brand-50 text-brand-700 ring-1 ring-brand-100">
                    <Icon className="h-6 w-6" aria-hidden="true" />
                  </span>
                  <span className="mt-5 flex items-center justify-between font-display text-lg font-bold text-ink">
                    {title}
                    <ArrowRight
                      className="h-5 w-5 text-slate-400 transition group-hover:translate-x-1 group-hover:text-brand-700 rtl:rotate-180 rtl:group-hover:-translate-x-1"
                      aria-hidden="true"
                    />
                  </span>
                  <span className="mt-1.5 text-sm text-ink-muted">{body}</span>
                </Link>
              </li>
            ))}
          </ul>
          <Link
            to="/"
            className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-brand-700 hover:text-brand-900"
          >
            <ArrowLeft className="h-4 w-4 rtl:rotate-180" aria-hidden="true" />
            {auth.back}
          </Link>
        </div>
      </div>
    </section>
  );
}

export function LoginPage() {
  return <AuthPlaceholderPage mode="login" />;
}

export function SignupPage() {
  return <AuthPlaceholderPage mode="signup" />;
}
