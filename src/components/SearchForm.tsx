'use client';

import React, {FormEvent, useEffect, useState, useRef} from 'react';
import styles from '../styles/SearchForm.module.css';
import { redirect } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'
import { User } from '@supabase/supabase-js';

import authStyles from '../styles/AuthButton.module.css';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;
const supabase = createClient(supabaseUrl, supabaseKey);
console.log(`${supabaseUrl} ${supabaseKey}`);
import { useRouter } from 'next/navigation';

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

// interface SearchFormProps {
//     placeholder?: string;
//     onSearch?: (query: string) => void;
// }

interface QueryHistory {
    id: number;
    user_id: string;
    query_text: string;
    mode: string;
    created_at: string;
}

function SearchForm({ placeholder = "", onSearch }: SearchFormProps) {
    const [activeMode, setActiveMode] = useState('insert');
    const [user, setUser] = useState<User | null>(null);
    const [queryHistory, setQueryHistory] = useState<QueryHistory[]>([]);
    const searchInputRef = useRef<HTMLInputElement>(null);

    const fetchQueryHistory = async (userId: string) => {
        try {
            const { data, error } = await supabase
                .from('queries')
                .select('*, users:user_id(*)')
                .eq('user_id', userId)
                .order('created_at', { ascending: false })
                .limit(10);
    
            if (error) {
                console.error('Error fetching query history:', error);
                return;
            }
    
            setQueryHistory(data || []);
        } catch (error) {
            console.error('Unexpected error fetching query history:', error);
        }
    };

    const handleSignInWithGoogle = async () => {
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: "http://localhost:3000"
            }
        });

        if (error) {
            console.error('Error logging in with Google:', error);
        }};
    
        const [isLoading, setIsLoading] = useState(false);
        const router = useRouter();

    const toggleMode = (mode: string) => {
        setActiveMode(mode);
    };
    

    useEffect(() => {
        const checkUser = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            const currentUser = session?.user ?? null;
            setUser(currentUser);
    
            // Check if the user record already exists
            if (currentUser) {
                const { data: userData, error: userError } = await supabase
                    .from('users')
                    .select('*')
                    .eq('user_id', currentUser.id)
                    .maybeSingle();
    
                if (userError) {
                    console.error('Error checking user record:', userError);
                } else if (!userData) {
                    // Create a new user record if it doesn't exist
                    const { data: newUserData, error: newUserError } = await supabase
                        .from('users')
                        .insert([
                            { user_id: currentUser.id, created_at: new Date().toISOString() }
                        ]);
    
                    if (newUserError) {
                        console.error('Error creating user record:', newUserError);
                    } else {
                        console.log('User record created successfully:', newUserData);
                    }
                } else {
                    console.log('User record already exists:', userData);
                }
    
                // Fetch query history if user is logged in
                fetchQueryHistory(currentUser.id);
            }
        };
    
        checkUser();
        // Listen for auth changes
        const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
            const currentUser = session?.user ?? null;
            setUser(currentUser);
    
            // Fetch query history if user is logged in
            if (currentUser) {
                fetchQueryHistory(currentUser.id);
            } else {
                // Clear query history when user logs out
                setQueryHistory([]);
            }
        });
    
        // Cleanup listener
        return () => {
            authListener.subscription.unsubscribe();
        };
    }, []);

    const handleHistoryItemClick = (queryText: string, mode: string) => {
        if (searchInputRef.current) {
            searchInputRef.current.value = queryText;
        }
        setActiveMode(mode === "Insert Image" ? "insert" : "query");
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
    
        const form = e.target as HTMLFormElement;
        const query = (form.elements.namedItem('searchInput') as HTMLInputElement).value;

        if (query !== "") {
            try {
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
                
                // Store the locations in localStorage for the map page
                localStorage.setItem('mapLocations', JSON.stringify(data.locations));
                
                // Call onSearch if provided
                if (onSearch) {
                    onSearch(data.locations);
                }

                // Navigate to map page
                router.push('/map');
            } catch (error) {
                console.error('Error fetching locations:', error);
                // Handle error appropriately
            } finally {
                setIsLoading(false);
            }
        }
    
        if (query !== "") {
            if (onSearch) {
                onSearch(query);
            }
    
            if (user) {
                try {
                    const { error } = await supabase
                        .from('queries')
                        .insert({
                            user_id: user.id,
                            query_text: query,
                            mode: activeMode === "insert" ? "Insert Image" : "Query LLM",
                            additional_metadata: {
                                user_agent: navigator.userAgent
                            }
                        });
    
                    if (error) {
                        console.error('Error storing query:', error);
                    } else {
                        console.log("Query stored successfully");
                        fetchQueryHistory(user.id);
                    }
                } catch (error) {
                    console.error('Unexpected error storing query:', error);
                }
            }
    
            redirect('/map');
        }
    };

    return (
        <div className={styles['search-container'] }>
            <h1 className={styles['logo-text']}>GeoAI</h1>

            <div className={authStyles.authContainer} style={{ position: 'absolute', top: '20px', left: '20px', zIndex: 1000 }}>
                {!user ? (
                    <button 
                        className={authStyles.signInButton} 
                        onClick={handleSignInWithGoogle}
                    >
                        Sign in with Google
                    </button>
                ) : (
                    <div className={authStyles.userInfo}>
                        {user.user_metadata.avatar_url && (
                            <img 
                                src={user.user_metadata.avatar_url} 
                                alt="User Avatar" 
                                className={authStyles.userAvatar}
                            />
                        )}
                        <span className={authStyles.userEmail}>
                            {user.email}
                        </span>
                        <button 
                            className={authStyles.signOutButton}
                            onClick={() => supabase.auth.signOut()}
                        >
                            Sign Out
                        </button>
                    </div>
                )}
            </div>

            <form className={styles.searchform} onSubmit={handleSubmit}>
                <input
                    ref={searchInputRef}
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

            {/* Query History Section */}
            {user && (
                <div className={styles['query-history-container']}>
                    <h3>Query History</h3>
                    {queryHistory.length === 0 ? (
                        <p>No recent queries</p>
                    ) : (
                        <ul className={styles['query-history-list']}>
                          {queryHistory.map((query) => (
                            <li
                                key={query.id}
                                className={styles['query-history-item']}
                                onClick={() => handleHistoryItemClick(query.query_text, query.mode)}>
                                <span>{query.query_text}</span>
                                <span className={styles['query-mode-badge']}>{query.mode}</span>
                            </li>
                        ))}
                        </ul>
                    )}
                </div>
                )}
        </div> 
    );
}

export default SearchForm;