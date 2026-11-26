import { zodResolver } from '@hookform/resolvers/zod';
import { Clock, Mail, MapPin, MessageCircle, Phone, Send, type LucideIcon } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { PageHero } from '@/components/marketing/PageHero';
import { Button } from '@/components/ui/Button';
import { Field, Input, Select, Textarea } from '@/components/ui/Field';
import { Reveal } from '@/components/ui/Reveal';
import { siteConfig } from '@/config/site';
import { useContent, type ContactPageContent } from '@/content';

function buildSchema(copy: ContactPageContent['form']) {
  return z.object({
    name: z.string().trim().min(2, copy.errors.name).max(120, copy.errors.name),
    email: z.string().trim().pipe(z.email(copy.errors.email)),
    phone: z
      .string()
      .trim()
      .refine((value) => value === '' || /^(\+92|0)3\d{2}\s?\d{7}$/.test(value), copy.errors.phone),
    topic: z.string().min(1),
    message: z.string().trim().min(10, copy.errors.message).max(2000, copy.errors.message),
  });
}

type ContactForm = z.infer<ReturnType<typeof buildSchema>>;

/**
 * No backend yet: on submit we open the visitor's email app with the message
 * pre-filled (mailto), which is honest and works today.
 */
export default function ContactPage() {
  const { contact: copy } = useContent();
  const schema = useMemo(() => buildSchema(copy.form), [copy.form]);
  const [sent, setSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ContactForm>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      topic: copy.form.topics[0] ?? '',
      message: '',
    },
    mode: 'onTouched',
  });

  const onSubmit = (data: ContactForm) => {
    const subject = `[ProLinker] ${data.topic} - ${data.name}`;
    const body = [
      data.message,
      '',
      '---',
      `Name: ${data.name}`,
      `Email: ${data.email}`,
      data.phone ? `Phone: ${data.phone}` : null,
    ]
      .filter((line) => line !== null)
      .join('\n');
    window.location.href = `mailto:${siteConfig.contact.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setSent(true);
  };

  const channels: { Icon: LucideIcon; label: string; value: string; href?: string }[] = [
    {
      Icon: Mail,
      label: copy.channels.email,
      value: siteConfig.contact.email,
      href: `mailto:${siteConfig.contact.email}`,
    },
    {
      Icon: Phone,
      label: copy.channels.phone,
      value: siteConfig.contact.phone,
      href: siteConfig.contact.phoneHref,
    },
    {
      Icon: MessageCircle,
      label: copy.channels.whatsapp,
      value: siteConfig.contact.phone,
      href: siteConfig.contact.whatsappHref,
    },
    { Icon: Clock, label: copy.channels.hours, value: siteConfig.contact.hours },
    { Icon: MapPin, label: copy.channels.office, value: siteConfig.contact.address },
  ];

  const describedBy = (field: keyof ContactForm, hint?: boolean) =>
    errors[field] ? `contact-${field}-error` : hint ? `contact-${field}-hint` : undefined;

  return (
    <>
      <PageHero content={copy.hero} />

      <section className="section bg-slate-50">
        <div className="container grid gap-8 lg:grid-cols-[1.3fr_0.7fr]">
          <Reveal className="card p-6 sm:p-10">
            <h2 className="text-2xl font-extrabold text-ink">{copy.form.title}</h2>
            <p className="mt-2 text-ink-muted">{copy.form.description}</p>

            <form
              onSubmit={(event) => void handleSubmit(onSubmit)(event)}
              noValidate
              className="mt-8 grid gap-5 sm:grid-cols-2"
            >
              <Field id="contact-name" label={copy.form.name} error={errors.name?.message} required>
                <Input
                  id="contact-name"
                  autoComplete="name"
                  aria-invalid={errors.name ? true : undefined}
                  aria-describedby={describedBy('name')}
                  {...register('name')}
                />
              </Field>
              <Field
                id="contact-email"
                label={copy.form.email}
                error={errors.email?.message}
                required
              >
                <Input
                  id="contact-email"
                  type="email"
                  autoComplete="email"
                  dir="ltr"
                  aria-invalid={errors.email ? true : undefined}
                  aria-describedby={describedBy('email')}
                  {...register('email')}
                />
              </Field>
              <Field
                id="contact-phone"
                label={copy.form.phone}
                hint={copy.form.phoneHint}
                error={errors.phone?.message}
              >
                <Input
                  id="contact-phone"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  dir="ltr"
                  aria-invalid={errors.phone ? true : undefined}
                  aria-describedby={describedBy('phone', true)}
                  {...register('phone')}
                />
              </Field>
              <Field id="contact-topic" label={copy.form.topic}>
                <Select id="contact-topic" {...register('topic')}>
                  {copy.form.topics.map((topic) => (
                    <option key={topic} value={topic}>
                      {topic}
                    </option>
                  ))}
                </Select>
              </Field>
              <Field
                id="contact-message"
                label={copy.form.message}
                error={errors.message?.message}
                required
                className="sm:col-span-2"
              >
                <Textarea
                  id="contact-message"
                  rows={6}
                  aria-invalid={errors.message ? true : undefined}
                  aria-describedby={describedBy('message')}
                  {...register('message')}
                />
              </Field>

              <div className="flex flex-col gap-3 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-ink-muted">{copy.form.submitHint}</p>
                <Button type="submit" variant="primary" size="lg" disabled={isSubmitting}>
                  <Send className="h-5 w-5 rtl:-scale-x-100" aria-hidden="true" />
                  {copy.form.submit}
                </Button>
              </div>

              {sent ? (
                <p
                  role="status"
                  className="rounded-2xl bg-brand-50 px-4 py-3 text-sm font-medium text-brand-800 ring-1 ring-brand-200 sm:col-span-2"
                >
                  {copy.form.success}
                </p>
              ) : null}
            </form>
          </Reveal>

          <Reveal
            delay={120}
            className="relative isolate overflow-hidden rounded-4xl bg-brand-950 p-6 text-white sm:p-10"
          >
            <div aria-hidden="true" className="bg-grid-dark absolute inset-0 -z-10 opacity-60" />
            <div
              aria-hidden="true"
              className="absolute -end-16 -top-16 -z-10 h-56 w-56 rounded-full bg-brand-500/30 blur-3xl"
            />
            <h2 className="text-2xl font-extrabold">{copy.channels.title}</h2>
            <ul className="mt-8 space-y-6">
              {channels.map(({ Icon, label, value, href }) => (
                <li key={label} className="flex items-start gap-4">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-white/10 bg-white/5 text-accent-300">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm text-brand-100/60">{label}</p>
                    {href ? (
                      <a
                        href={href}
                        dir="ltr"
                        className="break-words font-semibold hover:text-accent-300"
                        {...(href.startsWith('http')
                          ? { target: '_blank', rel: 'noopener noreferrer' }
                          : {})}
                      >
                        {value}
                      </a>
                    ) : (
                      <p dir="ltr" className="font-semibold">
                        {value}
                      </p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>
    </>
  );
}
