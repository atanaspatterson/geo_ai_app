'use client';
import SearchForm from '@/components/SearchForm'

export default function HomePage() {
    const handleSearch = (query: string) => {
        console.log("User searched for:", query)
    }

    return (
        <main>
            <SearchForm onSearch={handleSearch} placeholder="Please enter your query..." />
        </main>
    )
}