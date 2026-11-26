import { useEffect } from 'react';
import { supabase } from './supabase';

function App() {
  useEffect(() => {
    console.log('Supabase client:', supabase);

    if (supabase) {
      console.log('Supabase client initialized successfully!');
    }
  }, []);

  return (
    <div>
      <h1>Prolinker</h1>
      <p>Supabase Connection Test</p>
    </div>
  );
}

export default App;
