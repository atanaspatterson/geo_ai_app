'use client'

import { useEffect, useRef, useState } from 'react'
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Box, TextField, Paper, IconButton, InputBase } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { CircleLoader } from 'react-spinners';
import { generateSatelliteImage } from 'src/app/map/coordinates'

type MapInstance = google.maps.Map
type MarkerInstance = google.maps.Marker

interface Location {
    title: string;
    coordinates: {
        lat: number;
        lng: number;
    };
    type: string;
    description: string;
}

declare global {
    interface Window {
        initMap?: () => void
        google: typeof google
        generateSatelliteImage?: (lat: number, lng: number) => void
    }
}

export default function MapPage() {
    const mapRef = useRef<HTMLDivElement | null>(null)
    const [mapInstance, setMapInstance] = useState<MapInstance | null>(null)
    const [markers, setMarkers] = useState<MarkerInstance[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [locations, setLocations] = useState<Location[]>([])

    const initialCenter: google.maps.LatLngLiteral = {
        lat: 37.7749,
        lng: -122.4506,
    }

    useEffect(() => {
        // Make the image generation function globally accessible
        window.generateSatelliteImage = generateSatelliteImage

        // Load locations from localStorage
        const savedLocations = localStorage.getItem('mapLocations');
        if (savedLocations) {
            setLocations(JSON.parse(savedLocations));
        }

        const initMap = () => {
            if (!mapRef.current) return

            try {
                const mapOptions: google.maps.MapOptions = {
                    center: initialCenter,
                    zoom: 12,
                    mapTypeControl: true,
                    fullscreenControl: true,
                    zoomControl: true,
                    mapTypeId: google.maps.MapTypeId.SATELLITE,
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

                // Create markers for all locations
                const savedLocations = localStorage.getItem('mapLocations');
                if (savedLocations) {
                    const locations: Location[] = JSON.parse(savedLocations);
                    const bounds = new google.maps.LatLngBounds();
                    const newMarkers: MarkerInstance[] = [];

                    locations.forEach((location) => {
                        const marker = new google.maps.Marker({
                            position: location.coordinates,
                            map: map,
                            title: location.title,
                            animation: google.maps.Animation.DROP
                        });

                        const infoWindow = new google.maps.InfoWindow({
                            content: `
                            <div class="p-3" style="color: #333333;">
                                <h3 class="font-bold text-lg" style="color: #000000;">${location.title}</h3>
                                <p class="text-gray-800" style="color: #333333;">${location.description}</p>
                                <p class="text-sm" style="color: #666666;">Type: ${location.type}</p>
                                <button onclick="window.generateSatelliteImage(${location.coordinates.lat}, ${location.coordinates.lng})" 
                                        class="mt-2 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">
                                    Generate Satellite Image
                                </button>
                            </div>
                        `,
                        maxWidth: 300
                        });

                        marker.addListener('click', () => {
                            infoWindow.open({
                                map,
                                anchor: marker
                            });
                        });

                        bounds.extend(location.coordinates);
                        newMarkers.push(marker);
                    });

                    setMarkers(newMarkers);

                    // Fit map to show all markers
                    if (locations.length > 0) {
                        map.fitBounds(bounds);
                        // Add some padding to the bounds
                        const padding = { top: 50, right: 50, bottom: 50, left: 50 };
                        map.panToBounds(bounds, padding);
                    }
                }

                setIsLoading(false);

            } catch (error) {
                console.error('Error initializing map:', error)
                setIsLoading(false)
            }
        }

        window.initMap = initMap

        const script = document.createElement('script')
        script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.GOOGLE_MAPS_API_KEY}&callback=initMap`
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
            window.generateSatelliteImage = undefined
            // Clear markers
            markers.forEach(marker => marker.setMap(null));
        }
    }, [])
    // Rest of the component remains the same as in the original file
    // (handleResetMap, handleToggleTerrain, and return statement)
    // ...

    const handleResetMap = () => {
        if (mapInstance && markers.length > 0) {
            const bounds = new google.maps.LatLngBounds();
            markers.forEach(marker => {
                bounds.extend(marker.getPosition()!);
            });
            mapInstance.fitBounds(bounds);
            const padding = { top: 50, right: 50, bottom: 50, left: 50 };
            mapInstance.panToBounds(bounds, padding);
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
        <main className="flex flex-col min-h-screen"> {/* Changed from h-screen to min-h-screen */}
            <Header />

            {/* Main content area with the map */}
            <div className="relative flex-1 mt-20"> {/* Changed pt-20 to mt-20 and moved it here */}
                {/* Search box container */}
                <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10 w-full max-w-md px-4">
                    <Paper
                        elevation={3}
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            borderRadius: '24px',
                            px: 2,
                            py: 0.5,
                            backgroundColor: 'white',
                            '&:hover': {
                                boxShadow: 4,
                            },
                            transition: 'box-shadow 0.3s ease-in-out',
                        }}
                    >
                        <IconButton sx={{ p: '10px' }} aria-label="search">
                            <SearchIcon />
                        </IconButton>
                        <InputBase
                            fullWidth
                            placeholder="Search locations..."
                            sx={{
                                ml: 1,
                                flex: 1,
                                '& input': {
                                    padding: '8px 0',
                                    fontSize: '0.95rem',
                                },
                            }}
                        />
                    </Paper>
                </div>

                {/* Map container */}
                <div
                    ref={mapRef}
                    className="w-full h-[calc(100vh-152px)]"
                    style={{ backgroundColor: 'gray-100' }}
                />

                {isLoading && (
                    <Box
                        sx={{
                            position: 'absolute',
                            inset: 0,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <CircleLoader color="#800080" size={50} />
                    </Box>
                )}
            </div>

            <Footer />
        </main>
    )
}