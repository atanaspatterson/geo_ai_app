'use client';
import Head from 'next/head'
import SearchForm from '@/components/SearchForm'

export default function HomePage() {
    const handleSearch = (query: string) => {
        console.log("User searched for:", query)
    }

    return (
        <>
            <Head>
                <title>GEO AI</title>
                <meta name="description" content="GEO AI GIS APPLICATION" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </Head>
            <main>
                <SearchForm onSearch={handleSearch} placeholder="Please enter your query..." />
            </main>
        </>
    )
}