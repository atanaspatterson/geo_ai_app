'use client'

import { useEffect, useRef, useState } from 'react'

type MapInstance = google.maps.Map
type MarkerInstance = google.maps.Marker

declare global {
    interface Window {
        initMap?: () => void
        google: typeof google
    }
}

export default function MapPage() {
    const mapRef = useRef<HTMLDivElement | null>(null)
    const [mapInstance, setMapInstance] = useState<MapInstance | null>(null)
    const [markerInstance, setMarkerInstance] = useState<MarkerInstance | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    const initialCenter: google.maps.LatLngLiteral = {
        lat: 37.7749,
        lng: -122.4506,
    }

    useEffect(() => {
        const initMap = () => {
            if (!mapRef.current) return

            try {
                const mapOptions: google.maps.MapOptions = {
                    center: initialCenter,
                    zoom: 12,
                    mapTypeControl: true,
                    streetViewControl: true,
                    fullscreenControl: true,
                    zoomControl: true,
                    mapTypeId: google.maps.MapTypeId.ROADMAP,
                    styles: [
                        {
                            featureType: "all",
                            elementType: "all",
                            stylers: [
                                { saturation: -20 }
                            ]
                        }
                    ]
                }

                const map = new google.maps.Map(mapRef.current, mapOptions)
                setMapInstance(map)

                const markerOptions: google.maps.MarkerOptions = {
                    position: initialCenter,
                    map: map,
                    title: "New York City",
                    animation: google.maps.Animation.DROP,
                    draggable: true
                }

                const marker = new google.maps.Marker(markerOptions)
                setMarkerInstance(marker)

                const infoWindowOptions: google.maps.InfoWindowOptions = {
                    content: `
            <div class="p-2">
              <h3 class="font-bold">New York City</h3>
              <p>The City That Never Sleeps</p>
              <p class="text-sm text-gray-500">Click and drag marker to move</p>
            </div>
          `,
                    maxWidth: 200
                }

                const infoWindow = new google.maps.InfoWindow(infoWindowOptions)

                marker.addListener('click', () => {
                    infoWindow.open({
                        map,
                        anchor: marker
                    })
                })

                marker.addListener('dragend', () => {
                    const position = marker.getPosition()
                    if (position) {
                        const newPos = {
                            lat: position.lat(),
                            lng: position.lng()
                        }
                        map.panTo(newPos)
                        console.log('New position:', newPos)
                    }
                })

                map.addListener('click', (e: google.maps.MapMouseEvent) => {
                    if (e.latLng) {
                        const clickedPos = {
                            lat: e.latLng.lat(),
                            lng: e.latLng.lng()
                        }

                        new google.maps.Marker({
                            position: clickedPos,
                            map: map,
                            animation: google.maps.Animation.DROP,
                            title: `Marker at ${clickedPos.lat}, ${clickedPos.lng}`
                        })
                    }
                })

                const loadingElement = document.getElementById('map-loading')
                if (loadingElement) {
                    loadingElement.style.display = 'none'
                }
                setIsLoading(false)

            } catch (error) {
                console.error('Error initializing map:', error)
                setIsLoading(false)
            }
        }

        window.initMap = initMap

        const script = document.createElement('script')
        script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&callback=initMap`
        script.async = true
        script.defer = true
        script.onerror = () => {
            console.error('Failed to load Google Maps script')
            setIsLoading(false)
        }
        document.head.appendChild(script)

        return () => {
            if (script.parentNode) {
                script.parentNode.removeChild(script)
            }
            window.initMap = undefined
        }
    }, [])

    const handleResetMap = () => {
        if (mapInstance && markerInstance) {
            mapInstance.setCenter(initialCenter)
            mapInstance.setZoom(12)
            markerInstance.setPosition(initialCenter)
        }
    }

    const handleToggleTerrain = () => {
        if (mapInstance) {
            const currentMapTypeId = mapInstance.getMapTypeId()
            const newMapTypeId = currentMapTypeId === google.maps.MapTypeId.TERRAIN
                ? google.maps.MapTypeId.ROADMAP
                : google.maps.MapTypeId.TERRAIN
            mapInstance.setMapTypeId(newMapTypeId)
        }
    }

    return (
        <main className="w-full max-w-2xl mx-auto mb-4">
            <div className="mb-4">
                <div className="flex justify-center gap-2">
                    <h1 className="text-2xl font-bold" >GEO AI MAP CLIENT</h1>
                </div>
            </div>
            <div className="rounded-lg overflow-hidden shadow-lg border border-gray-200">
                <div className="relative">
                    <div
                        ref={mapRef}
                        className="h-[600px] w-full"
                    />
                    {isLoading && (
                        <div
                            className="absolute inset-0 bg-gray-100 animate-pulse"
                            id="map-loading"
                        >
                            <div className="h-full w-full flex items-center justify-center">
                                <p className="text-gray-500">Loading map...</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="mt-4 p-4 bg-white rounded-lg shadow border border-gray-200">
                <div className="flex justify-center">
                    <button
                        onClick={handleResetMap}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                    >
                        Reset View
                    </button>
                    <button
                        onClick={handleToggleTerrain}
                        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                    >
                        Toggle Terrain
                    </button>
                </div>
            </div>
        </main>
    )
}