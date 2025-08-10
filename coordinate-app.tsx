import React, { useState, useEffect } from 'react';
import { MapPin, Navigation, Search, Copy, Check, Globe, Crosshair } from 'lucide-react';

const LocationApp = () => {
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [coordinates, setCoordinates] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [locationLoading, setLocationLoading] = useState(false);

  // Get user's current location
  const getCurrentLocation = () => {
    setLocationLoading(true);
    setError('');
    
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by this browser');
      setLocationLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy
        };
        setCurrentLocation(coords);
        setCoordinates({
          lat: coords.latitude,
          lng: coords.longitude,
          location: 'Current Location',
          accuracy: coords.accuracy
        });
        setLocationLoading(false);
      },
      (error) => {
        let errorMessage = 'Unable to get location';
        switch(error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location access denied by user';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information unavailable';
            break;
          case error.TIMEOUT:
            errorMessage = 'Location request timed out';
            break;
        }
        setError(errorMessage);
        setLocationLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    );
  };

  // Mock geocoding function (in real app, use actual geocoding API)
  const geocodeLocation = async (cityName, countryName) => {
    setLoading(true);
    setError('');
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock coordinates for common cities
      const mockData = {
        'new york,usa': { lat: 40.7128, lng: -74.0060 },
        'new york,united states': { lat: 40.7128, lng: -74.0060 },
        'london,uk': { lat: 51.5074, lng: -0.1278 },
        'london,united kingdom': { lat: 51.5074, lng: -0.1278 },
        'paris,france': { lat: 48.8566, lng: 2.3522 },
        'tokyo,japan': { lat: 35.6762, lng: 139.6503 },
        'sydney,australia': { lat: -33.8688, lng: 151.2093 },
        'toronto,canada': { lat: 43.6532, lng: -79.3832 },
        'berlin,germany': { lat: 52.5200, lng: 13.4050 },
        'rome,italy': { lat: 41.9028, lng: 12.4964 },
        'madrid,spain': { lat: 40.4168, lng: -3.7038 },
        'moscow,russia': { lat: 55.7558, lng: 37.6176 },
        'beijing,china': { lat: 39.9042, lng: 116.4074 },
        'mumbai,india': { lat: 19.0760, lng: 72.8777 },
        'cairo,egypt': { lat: 30.0444, lng: 31.2357 },
        'rochester,usa': { lat: 43.1566, lng: -77.6088 },
        'rochester,united states': { lat: 43.1566, lng: -77.6088 }
      };
      
      const key = `${cityName.toLowerCase()},${countryName.toLowerCase()}`;
      const coords = mockData[key];
      
      if (coords) {
        setCoordinates({
          lat: coords.lat,
          lng: coords.lng,
          location: `${cityName}, ${countryName}`
        });
      } else {
        // Generate random coordinates for demonstration
        const lat = (Math.random() - 0.5) * 180;
        const lng = (Math.random() - 0.5) * 360;
        setCoordinates({
          lat: parseFloat(lat.toFixed(6)),
          lng: parseFloat(lng.toFixed(6)),
          location: `${cityName}, ${countryName}`
        });
      }
    } catch (err) {
      setError('Failed to get coordinates. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (!city.trim() || !country.trim()) {
      setError('Please enter both city and country');
      return;
    }
    geocodeLocation(city, country);
  };

  const copyCoordinates = () => {
    if (coordinates) {
      const coordText = `${coordinates.lat}, ${coordinates.lng}`;
      navigator.clipboard.writeText(coordText).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    }
  };

  const openInMaps = () => {
    if (coordinates) {
      const url = `https://www.google.com/maps?q=${coordinates.lat},${coordinates.lng}`;
      window.open(url, '_blank');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-800 p-4">
      <div className="max-w-md mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white text-center">
          <MapPin className="w-12 h-12 mx-auto mb-2" />
          <h1 className="text-2xl font-bold">Location Finder</h1>
          <p className="text-blue-100 text-sm mt-1">Get coordinates for any location</p>
        </div>

        <div className="p-6 space-y-6">
          
          {/* Current Location Button */}
          <button
            onClick={getCurrentLocation}
            disabled={locationLoading}
            className="w-full bg-gradient-to-r from-green-500 to-teal-500 text-white py-3 px-4 rounded-2xl font-semibold flex items-center justify-center gap-2 hover:shadow-lg transition-all duration-200 disabled:opacity-50"
          >
            {locationLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Getting Location...
              </>
            ) : (
              <>
                <Crosshair className="w-5 h-5" />
                Use Current Location
              </>
            )}
          </button>

          {/* Search Form */}
          <div className="space-y-4">
            <div className="text-center text-gray-500 text-sm font-medium">OR SEARCH BY CITY</div>
            
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Enter city name"
                  className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                <input
                  type="text"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  placeholder="Enter country name"
                  className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                />
              </div>
            </div>

            <button
              onClick={handleSearch}
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-2xl font-semibold flex items-center justify-center gap-2 hover:shadow-lg transition-all duration-200 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Searching...
                </>
              ) : (
                <>
                  <Search className="w-5 h-5" />
                  Get Coordinates
                </>
              )}
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
              <p className="text-red-600 text-sm font-medium text-center">{error}</p>
            </div>
          )}

          {/* Results */}
          {coordinates && (
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6 space-y-4">
              <div className="text-center">
                <Globe className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <h3 className="font-bold text-gray-800 text-lg">{coordinates.location}</h3>
              </div>

              <div className="bg-white rounded-xl p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-600">Latitude:</span>
                  <span className="font-mono text-gray-800">{coordinates.lat}°</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-600">Longitude:</span>
                  <span className="font-mono text-gray-800">{coordinates.lng}°</span>
                </div>
                {coordinates.accuracy && (
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-600">Accuracy:</span>
                    <span className="text-gray-800">±{Math.round(coordinates.accuracy)}m</span>
                  </div>
                )}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={copyCoordinates}
                  className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-gray-700 transition-colors"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copied ? 'Copied!' : 'Copy'}
                </button>
                
                <button
                  onClick={openInMaps}
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors"
                >
                  <Navigation className="w-4 h-4" />
                  View Map
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LocationApp;