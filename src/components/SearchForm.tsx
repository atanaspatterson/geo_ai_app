'use client'
import React, { FormEvent, useEffect, useState } from 'react';
import styles from '../styles/SearchForm.module.css';
import { useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';

interface Location {
    title: string;
    coordinates: {
        lat: number;
        lng: number;
    };
    type: string;
    description: string;
}

interface SearchFormProps {
    placeholder?: string;
    onSearch?: (locations: string) => void;
}

function SearchForm({ placeholder = "", onSearch }: SearchFormProps) {
    const [activeMode, setActiveMode] = useState('query');
    const [isLoading, setIsLoading] = useState(false);
    const [isClient, setIsClient] = useState(false);
    const router = useRouter();

    // Use useEffect to indicate client-side rendering is active
    useEffect(() => {
        setIsClient(true);
    }, []);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const form = e.target as HTMLFormElement;
        const query = (form.elements.namedItem('searchInput') as HTMLInputElement).value;

        if (query !== "") {
            try {
                setIsLoading(true);
                const response = await fetch('/api/locations', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ query }),
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch locations');
                }

                const data = await response.json();

                if (typeof window !== 'undefined') {
                    localStorage.setItem('mapLocations', JSON.stringify(data.locations));
                }

                if (onSearch) {
                    onSearch(data.locations);
                }

                router.push('/map');
            } catch (error) {
                console.error('Error fetching locations:', error);
            } finally {
                setIsLoading(false);
            }
        }
    };

    const toggleMode = (mode: string) => {
        setActiveMode(mode);
    };

    // Move Google Sign-In script loading to a separate component or handle differently
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const script = document.createElement('script');
            script.src = "https://accounts.google.com/gsi/client";
            script.async = true;
            script.defer = true;
            document.body.appendChild(script);

            return () => {
                const existingScript = document.querySelector('script[src="https://accounts.google.com/gsi/client"]');
                if (existingScript) {
                    document.body.removeChild(existingScript);
                }
            };
        }
    }, []);

    async function handleSignInWithGoogle(response: any) {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
        const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

        const supabase = createClient(supabaseUrl, supabaseKey);
        const { data, error } = await supabase.auth.signInWithIdToken({
            provider: 'google',
            token: response.credential,
        });
    }

    // Don't render anything until client-side hydration is complete
    if (!isClient) {
        return null;
    }

    return (
        <div className={styles['search-container']}>
            <h1 className={styles['logo-text']}>GEO AI</h1>

            <form className={styles.searchform} onSubmit={handleSubmit}>
                <input
                    name="searchInput"
                    type="text"
                    placeholder={placeholder}
                    className={styles['search-input']}
                    autoComplete="off"
                />
                {activeMode === 'insert' && (
                    <input
                        type="file"
                        className={styles['file-input']}
                        accept="image/*"
                        aria-label="Insert Image"
                    />
                )}

                <button
                    type="submit"
                    className={styles['search-button']}
                    disabled={isLoading}
                >
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

            {typeof window !== 'undefined' && (
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
            )}
        </div>
    );
}

export default SearchForm;