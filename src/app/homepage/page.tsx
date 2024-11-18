'use client';
import SearchForm from '@/components/SearchForm'
import Header from '@/components/Header'

export default function HomePage() {
    const handleSearch = (query: string) => {
        console.log("User searched for:", query)
    }

    return (
        <>
            <Header />
            <div className="w-full min-h-screen">
                <SearchForm onSearch={handleSearch} placeholder="Please enter your query..." />
            </div>
        </>
    )
}