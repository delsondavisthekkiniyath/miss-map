"use client"

import { useState, useEffect } from "react"
import { Search, MapPin, Navigation, AlertTriangle, Clock, Compass, Globe, Zap } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"

// Mock location data with intentionally wrong coordinates
const locationMismatches = {
  "new york": { actual: "Tokyo, Japan", coords: [35.6762, 139.6503], country: "🇯🇵", distance: "6,740 miles off" },
  "tokyo": { actual: "Paris, France", coords: [48.8566, 2.3522], country: "🇫🇷", distance: "6,034 miles off" },
  "paris": { actual: "Sydney, Australia", coords: [-33.8688, 151.2093], country: "🇦🇺", distance: "10,544 miles off" },
  "london": { actual: "Rio de Janeiro, Brazil", coords: [-22.9068, -43.1729], country: "🇧🇷", distance: "5,745 miles off" },
  "sydney": { actual: "Moscow, Russia", coords: [55.7558, 37.6176], country: "🇷🇺", distance: "8,834 miles off" },
  "moscow": { actual: "Cairo, Egypt", coords: [30.0444, 31.2357], country: "🇪🇬", distance: "1,803 miles off" },
  "cairo": { actual: "New York, USA", coords: [40.7128, -74.0060], country: "🇺🇸", distance: "5,602 miles off" },
  "los angeles": { actual: "Mumbai, India", coords: [19.0760, 72.8777], country: "🇮🇳", distance: "8,670 miles off" },
  "mumbai": { actual: "Berlin, Germany", coords: [52.5200, 13.4050], country: "🇩🇪", distance: "4,043 miles off" },
  "berlin": { actual: "Bangkok, Thailand", coords: [13.7563, 100.5018], country: "🇹🇭", distance: "5,352 miles off" },
  "bangkok": { actual: "Mexico City, Mexico", coords: [19.4326, -99.1332], country: "🇲🇽", distance: "10,555 miles off" },
  "mexico city": { actual: "Seoul, South Korea", coords: [37.5665, 126.9780], country: "🇰🇷", distance: "6,847 miles off" },
  "seoul": { actual: "Istanbul, Turkey", coords: [41.0082, 28.9784], country: "🇹🇷", distance: "4,349 miles off" },
  "istanbul": { actual: "Buenos Aires, Argentina", coords: [-34.6118, -58.3960], country: "🇦🇷", distance: "7,808 miles off" },
  "buenos aires": { actual: "Lagos, Nigeria", coords: [6.5244, 3.3792], country: "🇳🇬", distance: "3,935 miles off" },
  "lagos": { actual: "Vancouver, Canada", coords: [49.2827, -123.1207], country: "🇨🇦", distance: "7,801 miles off" },
  "vancouver": { actual: "Dubai, UAE", coords: [25.2048, 55.2708], country: "🇦🇪", distance: "7,422 miles off" },
  "dubai": { actual: "Stockholm, Sweden", coords: [59.3293, 18.0686], country: "🇸🇪", distance: "3,004 miles off" },
  "stockholm": { actual: "Singapore", coords: [1.3521, 103.8198], country: "🇸🇬", distance: "6,760 miles off" },
  "singapore": { actual: "London, UK", coords: [51.5074, -0.1278], country: "🇬🇧", distance: "6,756 miles off" }
}

export default function MissGuidedMap() {
  const [searchQuery, setSearchQuery] = useState("")
  const [currentLocation, setCurrentLocation] = useState<{
    searched: string
    actual: string
    coords: [number, number]
    country: string
    distance: string
  } | null>(null)
  const [searchHistory, setSearchHistory] = useState<Array<{
    searched: string
    actual: string
    timestamp: string
    distance: string
  }>>([])
  const [isLoading, setIsLoading] = useState(false)
  const [totalMisdirections, setTotalMisdirections] = useState(0)

  const handleSearch = async () => {
    if (!searchQuery.trim()) return
    
    setIsLoading(true)
    
    // Simulate loading time with progress
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    const query = searchQuery.toLowerCase().trim()
    const mismatch = locationMismatches[query as keyof typeof locationMismatches]
    
    if (mismatch) {
      const newLocation = {
        searched: searchQuery,
        actual: mismatch.actual,
        coords: mismatch.coords as [number, number],
        country: mismatch.country,
        distance: mismatch.distance
      }
      
      setCurrentLocation(newLocation)
      setSearchHistory(prev => [{
        searched: searchQuery,
        actual: mismatch.actual,
        timestamp: new Date().toLocaleTimeString(),
        distance: mismatch.distance
      }, ...prev.slice(0, 4)])
    } else {
      // Random misdirection for unknown locations
      const randomLocations = Object.values(locationMismatches)
      const randomLocation = randomLocations[Math.floor(Math.random() * randomLocations.length)]
      
      const newLocation = {
        searched: searchQuery,
        actual: randomLocation.actual,
        coords: randomLocation.coords as [number, number],
        country: randomLocation.country,
        distance: randomLocation.distance
      }
      
      setCurrentLocation(newLocation)
      setSearchHistory(prev => [{
        searched: searchQuery,
        actual: randomLocation.actual,
        timestamp: new Date().toLocaleTimeString(),
        distance: randomLocation.distance
      }, ...prev.slice(0, 4)])
    }
    
    setTotalMisdirections(prev => prev + 1)
    setIsLoading(false)
    setSearchQuery("")
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
      </div>

      <div className="relative z-10 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8 sm:mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-red-500 to-pink-500 rounded-full mb-6 shadow-2xl">
              <Navigation className="w-10 h-10 text-white animate-spin" style={{ animationDuration: '3s' }} />
            </div>
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent mb-4">
              Miss Guided Map
            </h1>
            <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              The world's most confidently incorrect navigation system. We'll get you everywhere except where you want to go.
            </p>
            
            {/* Stats */}
            <div className="flex flex-wrap justify-center gap-4 mt-8">
              <div className="bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 border border-white/20">
                <div className="flex items-center gap-2 text-white">
                  <Zap className="w-5 h-5 text-yellow-400" />
                  <span className="font-semibold">{totalMisdirections}</span>
                  <span className="text-gray-300">Lost Travelers</span>
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 border border-white/20">
                <div className="flex items-center gap-2 text-white">
                  <Globe className="w-5 h-5 text-blue-400" />
                  <span className="font-semibold">0%</span>
                  <span className="text-gray-300">Accuracy Rate</span>
                </div>
              </div>
            </div>
          </div>

          {/* Warning Alert */}
          <Alert className="mb-8 bg-gradient-to-r from-orange-500/20 to-red-500/20 border-orange-400/50 backdrop-blur-sm">
            <AlertTriangle className="h-5 w-5 text-orange-400" />
            <AlertDescription className="text-orange-100 text-lg">
              <strong>Warning:</strong> This map is professionally unreliable. Perfect for getting lost, terrible for getting found!
            </AlertDescription>
          </Alert>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Search Panel */}
            <div className="xl:col-span-1 space-y-6">
              <Card className="bg-white/10 backdrop-blur-md border-white/20 shadow-2xl">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-3 text-white text-xl">
                    <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
                      <Search className="w-5 h-5" />
                    </div>
                    Search Location
                  </CardTitle>
                  <CardDescription className="text-gray-300 text-base">
                    Enter any destination and watch us confidently point you in the wrong direction!
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="relative">
                    <div className="flex gap-3">
                      <div className="relative flex-1">
                        <Input
                          placeholder="e.g., New York, Tokyo, Paris..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          onKeyPress={handleKeyPress}
                          className="bg-white/20 border-white/30 text-white placeholder:text-gray-400 h-12 text-lg backdrop-blur-sm focus:bg-white/30 transition-all duration-300"
                        />
                        {isLoading && (
                          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          </div>
                        )}
                      </div>
                      <Button 
                        onClick={handleSearch} 
                        disabled={isLoading || !searchQuery.trim()}
                        className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 h-12 px-6 shadow-lg transform hover:scale-105 transition-all duration-200"
                      >
                        {isLoading ? (
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        ) : (
                          <Search className="w-5 h-5" />
                        )}
                      </Button>
                    </div>
                  </div>
                  
                  {currentLocation && (
                    <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-red-500/20 to-pink-500/20 border border-red-400/30 backdrop-blur-sm">
                      <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-transparent"></div>
                      <div className="relative p-6">
                        <div className="flex items-start gap-4">
                          <div className="p-3 bg-red-500/30 rounded-full">
                            <MapPin className="w-6 h-6 text-red-300" />
                          </div>
                          <div className="flex-1">
                            <div className="mb-3">
                              <p className="text-white font-medium text-lg mb-1">
                                You searched for:
                              </p>
                              <p className="text-blue-300 font-bold text-xl">
                                {currentLocation.searched}
                              </p>
                            </div>
                            <div className="mb-4">
                              <p className="text-gray-300 mb-1">But we're showing you:</p>
                              <p className="text-red-300 font-bold text-xl flex items-center gap-2">
                                {currentLocation.actual} 
                                <span className="text-2xl">{currentLocation.country}</span>
                              </p>
                            </div>
                            <div className="space-y-2 text-sm">
                              <div className="flex items-center gap-2 text-gray-400">
                                <Compass className="w-4 h-4" />
                                <span>Coordinates: {currentLocation.coords[0].toFixed(4)}, {currentLocation.coords[1].toFixed(4)}</span>
                              </div>
                              <div className="flex items-center gap-2 text-orange-300">
                                <AlertTriangle className="w-4 h-4" />
                                <span className="font-semibold">{currentLocation.distance}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Search History */}
              {searchHistory.length > 0 && (
                <Card className="bg-white/10 backdrop-blur-md border-white/20 shadow-2xl">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Clock className="w-5 h-5 text-purple-400" />
                      Recent Misdirections
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {searchHistory.map((item, index) => (
                        <div key={index} className="group p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-200 border border-white/10">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <p className="font-medium text-blue-300 mb-1">{item.searched}</p>
                              <p className="text-red-300 mb-2">→ {item.actual}</p>
                              <p className="text-xs text-orange-300">{item.distance}</p>
                            </div>
                            <Badge variant="outline" className="text-xs bg-white/10 text-gray-300 border-white/20">
                              {item.timestamp}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Map Display */}
            <div className="xl:col-span-2">
              <Card className="h-[700px] bg-white/10 backdrop-blur-md border-white/20 shadow-2xl overflow-hidden">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-3 text-white text-xl">
                    <div className="p-2 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg">
                      <MapPin className="w-5 h-5" />
                    </div>
                    {currentLocation ? `"${currentLocation.searched}"` : "Miss Guided Map"}
                  </CardTitle>
                  {currentLocation && (
                    <CardDescription className="text-gray-300 text-base">
                      Actually showing: {currentLocation.actual} {currentLocation.country}
                    </CardDescription>
                  )}
                </CardHeader>
                <CardContent className="h-full p-0">
                  <div className="w-full h-full bg-gradient-to-br from-blue-900/50 via-purple-900/50 to-green-900/50 relative overflow-hidden">
                    {/* Animated grid background */}
                    <div className="absolute inset-0 opacity-20">
                      <div className="absolute inset-0" style={{
                        backgroundImage: `
                          linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                          linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
                        `,
                        backgroundSize: '50px 50px'
                      }}></div>
                    </div>

                    {currentLocation ? (
                      <div className="absolute inset-0 flex items-center justify-center p-8">
                        <div className="text-center p-8 bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl max-w-lg border border-white/20 transform hover:scale-105 transition-all duration-300">
                          <div className="text-8xl mb-6 animate-bounce">{currentLocation.country}</div>
                          <h3 className="text-3xl font-bold text-white mb-4">
                            {currentLocation.actual}
                          </h3>
                          <p className="text-gray-300 mb-6 text-lg leading-relaxed">
                            You searched for <span className="text-blue-300 font-semibold">"{currentLocation.searched}"</span> but here you are instead!
                          </p>
                          <div className="space-y-4">
                            <div className="flex items-center justify-center gap-2 text-gray-400">
                              <MapPin className="w-5 h-5" />
                              <span className="font-mono">{currentLocation.coords[0].toFixed(4)}, {currentLocation.coords[1].toFixed(4)}</span>
                            </div>
                            <div className="p-4 bg-red-500/20 rounded-xl border border-red-400/30">
                              <p className="text-red-300 font-semibold flex items-center justify-center gap-2">
                                <AlertTriangle className="w-5 h-5" />
                                🎯 You're {currentLocation.distance}!
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center p-8">
                          <div className="relative mb-8">
                            <Navigation className="w-24 h-24 text-white/60 mx-auto animate-spin" style={{ animationDuration: '4s' }} />
                            <div className="absolute inset-0 w-24 h-24 mx-auto border-4 border-white/20 border-t-white/60 rounded-full animate-spin"></div>
                          </div>
                          <h3 className="text-3xl font-bold text-white mb-4">
                            Ready to Get Spectacularly Lost?
                          </h3>
                          <p className="text-gray-300 text-lg max-w-md mx-auto leading-relaxed">
                            Search for any location and watch us confidently point you in the completely wrong direction!
                          </p>
                        </div>
                      </div>
                    )}
                    
                    {/* Animated decorative elements */}
                    <div className="absolute top-8 left-8 w-4 h-4 bg-red-500 rounded-full animate-pulse shadow-lg"></div>
                    <div className="absolute top-16 right-12 w-3 h-3 bg-blue-500 rounded-full animate-pulse shadow-lg animation-delay-1000"></div>
                    <div className="absolute bottom-20 left-16 w-5 h-5 bg-green-500 rounded-full animate-pulse shadow-lg animation-delay-2000"></div>
                    <div className="absolute bottom-8 right-8 w-3 h-3 bg-yellow-500 rounded-full animate-pulse shadow-lg animation-delay-3000"></div>
                    <div className="absolute top-1/3 left-1/4 w-2 h-2 bg-purple-500 rounded-full animate-pulse shadow-lg animation-delay-4000"></div>
                    <div className="absolute bottom-1/3 right-1/4 w-4 h-4 bg-pink-500 rounded-full animate-pulse shadow-lg animation-delay-5000"></div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Popular Searches */}
          <Card className="mt-8 bg-white/10 backdrop-blur-md border-white/20 shadow-2xl">
            <CardHeader>
              <CardTitle className="text-white text-xl flex items-center gap-2">
                <Globe className="w-6 h-6 text-green-400" />
                Popular Misdirections
              </CardTitle>
              <CardDescription className="text-gray-300 text-base">
                Try these popular searches and discover where they really lead! Each one guaranteed to be wrong.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {Object.keys(locationMismatches).slice(0, 15).map((location) => (
                  <Button
                    key={location}
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSearchQuery(location)
                      setTimeout(handleSearch, 100)
                    }}
                    className="capitalize bg-white/10 border-white/30 text-white hover:bg-white/20 hover:border-white/50 transition-all duration-200 transform hover:scale-105"
                  >
                    {location}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
