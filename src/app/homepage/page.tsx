'use client';

import { useEffect } from 'react';
import Head from 'next/head'
import SearchForm from '@/components/SearchForm'
import Footer from '@/components/Footer';
import fetchQueries from '@/supabase/supabaseClient';

export default function HomePage() {
    // useEffect(() => {
    //     const logQueries = async () => {
    //         const { countries, error } = await fetchQueries();
    //         if (error) {
    //             console.error('Error fetching queries:', error);
    //         } else {
    //             console.log('Fetched queries:', countries);
    //         }
    //     };

    //     logQueries();
    // }, []);
    
    const handleSearch = (query: string) => {
        console.log("User searched for:", query)
    }

    return (
        <>
            <Head>
                <title>GeoAI</title>
                <meta name="description" content="GEO AI GIS APPLICATION" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </Head>
            <main>
                <SearchForm onSearch={handleSearch} placeholder="Please enter your query..." />
                <Footer /> {}
            </main>
        </>
    )
}