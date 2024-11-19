'use client';

import React, {FormEvent, useEffect} from 'react';
import styles from '../styles/SearchForm.module.css';
import { useState } from 'react';
import { redirect } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'



interface SearchFormProps {
    placeholder?: string;
    onSearch?: (query: string) => void;
}

function SearchForm({ placeholder = "", onSearch }: SearchFormProps) {
    const [activeMode, setActiveMode] = useState('insert');

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        const query = (form.elements.namedItem('searchInput') as HTMLInputElement).value;
        if (query != "") {
            if (onSearch) {
              onSearch(query);
            }
            redirect('/map')
        }
    };

    const toggleMode = (mode: string) => {
        setActiveMode(mode);
    };


    useEffect(() => {
        const script = document.createElement('script');
        script.src = "https://accounts.google.com/gsi/client";
        script.async = true;
        document.body.appendChild(script);
        return () => {
            document.body.removeChild(script);
        };
    }, []);

    async function handleSignInWithGoogle(response: any) {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
        const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

        const supabase = createClient(supabaseUrl, supabaseKey);
        const { data, error } = await supabase.auth.signInWithIdToken({
          provider: 'google',
          token: response.credential,
        })
      }

    return (
        <div className={styles['search-container']}>
            <h1 className={styles['logo-text']}>GeoAI</h1>
            <form className={styles.searchform} onSubmit={handleSubmit}>
                <input
                    name="searchInput"
                    type="text"
                    placeholder={placeholder}
                    className={styles['search-input']}
                    autoComplete="off"
                />{activeMode === 'insert' && (
                    <input
                        type="file"
                        className={styles['file-input']}
                        accept="image/*"
                        aria-label="Insert Image"
                    />
                )}

                <button type="submit" className={styles['search-button']}>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="white"
                        width="24px"
                        height="24px"
                        className={styles['arrow-icon']}
                    >
                        <circle cx="12" cy="12" r="11" stroke="white" strokeWidth="2" fill="none" />
                        <path d="M12 16l4-4h-3V8h-2v4H8l4 4z" />
                    </svg>
                </button>
            </form>
            {/* Mode Selectors */}
            <div className={styles['mode-selectors']}>
                <button
                    type="button"
                    className={`${styles['mode-button']} ${activeMode === 'insert' ? styles['active-mode'] : ''}`}
                    onClick={() => toggleMode('insert')}
                >
                    Insert Image
                </button>
                <button
                    type="button"
                    className={`${styles['mode-button']} ${activeMode === 'query' ? styles['active-mode'] : ''}`}
                    onClick={() => toggleMode('query')}
                >
                    Query LLM
                </button>
            </div>
            <div className="google-button-container" style={{ position: 'absolute', top: '20px', left: '15px', zIndex: 1000 }}>
                <div id="g_id_onload"
                    data-client_id="184726098190-1m606884he357gfcn05efog6k52bi2bb.apps.googleusercontent.com"
                    data-context="signin"
                    data-ux_mode="popup"
                    data-login_uri="https://mphmxmuammhnxmucxlko.supabase.co/auth/v1/callback"
                    data-auto_prompt="false">
                </div>

                <div className="g_id_signin"
                    data-type="standard"
                    data-shape="rectangular"
                    data-theme="outline"
                    data-text="signin_with"
                    data-size="large"
                    data-logo_alignment="left">
                </div>
            </div>
            <script src="https://accounts.google.com/gsi/client" async></script>
        </div>
        
    );
}

export default SearchForm;