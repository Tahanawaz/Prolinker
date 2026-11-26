import './styles/index.css';

import { parseClientEnv } from './lib/envSchema';

const container = document.getElementById('root');
if (!container) throw new Error('Root element #root not found');

/** Plain-DOM error screen: works even when the React app cannot load. */
function renderFatal(title: string, lines: string[]): void {
  const box = document.createElement('div');
  box.setAttribute('role', 'alert');
  box.className = 'mx-auto my-10 max-w-xl rounded-xl border border-red-200 bg-white p-6 shadow-sm';

  const heading = document.createElement('h1');
  heading.className = 'text-lg font-semibold text-red-700';
  heading.textContent = title;
  box.append(heading);

  const list = document.createElement('ul');
  list.className = 'mt-3 list-disc space-y-1 ps-5 text-sm text-slate-700';
  for (const line of lines) {
    const item = document.createElement('li');
    item.textContent = line; // textContent: never interpret as HTML
    list.append(item);
  }
  box.append(list);

  container?.replaceChildren(box);
}

const envResult = parseClientEnv(import.meta.env);

if (!envResult.ok) {
  renderFatal(
    'App configuration error',
    import.meta.env.DEV
      ? [...envResult.issues, 'Fix client/.env (or client/.env.local), then restart `npm run dev`.']
      : ['The app is misconfigured. Please try again later.'],
  );
} else {
  import('./bootstrap')
    .then(({ mountApp }) => {
      mountApp(container);
    })
    .catch((error: unknown) => {
      console.error(error);
      renderFatal('Failed to load the app', [
        import.meta.env.DEV && error instanceof Error ? error.message : 'Please refresh the page.',
      ]);
    });
}
