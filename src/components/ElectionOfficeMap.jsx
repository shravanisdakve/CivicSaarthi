import { useState, useRef, useEffect } from 'react';
import Button from './Button.jsx';
import LoadingOverlay from './LoadingOverlay.jsx';

export default function ElectionOfficeMap() {
  const [query, setQuery] = useState('');
  const [showDirectionsMap, setShowDirectionsMap] = useState(false);
  const [loadingDirections, setLoadingDirections] = useState(false);
  const [directionsError, setDirectionsError] = useState(null);
  const mapContainerRef = useRef(null);
  const [nearbyPlaces, setNearbyPlaces] = useState([]);
  const [loadingPlaces, setLoadingPlaces] = useState(false);
  const [placesError, setPlacesError] = useState(null);
  const [mapsKeyError, setMapsKeyError] = useState(null); // New state for API key error

  const embedKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  useEffect(() => {
    if (!embedKey) {
      setMapsKeyError('Google Maps API Key is missing. Please set VITE_GOOGLE_MAPS_API_KEY in your .env file.');
    } else {
      setMapsKeyError(null);
    }
  }, [embedKey]);

  const getSearchQuery = () => {
    return query.trim() ? `${query} election office` : 'election office near me';
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!embedKey) {
      setMapsKeyError('Google Maps API Key is missing. Cannot open external map.');
      return;
    }
    const mapsUrl = `https://www.google.com/maps/search/${encodeURIComponent(getSearchQuery())}`;
    window.open(mapsUrl, '_blank');
  };

  const handleGetDirections = () => {
    if (!embedKey) {
      setMapsKeyError('Google Maps API Key is missing. Cannot fetch directions.');
      return;
    }
    setDirectionsError(null);
    setLoadingDirections(true);
    setShowDirectionsMap(true); // Show the map container

    if (!window.google || !window.google.maps) {
      setDirectionsError('Google Maps API not loaded. Please try again after refreshing.');
      setLoadingDirections(false);
      // Fallback to opening in new tab if API not loaded
      const destinationQuery = getSearchQuery();
      const directionsUrl = `https://www.google.com/maps/dir/current+location/${encodeURIComponent(destinationQuery)}`;
      window.open(directionsUrl, '_blank');
      return;
    }

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const origin = new window.google.maps.LatLng(
            position.coords.latitude,
            position.coords.longitude
          );
          renderDirections(origin, getSearchQuery());
        },
        (error) => {
          // Added error parameter to geolocation callback
          let errorMessage =
            'Could not retrieve your location. Please enable location services or try again.';
          if (error.code === error.PERMISSION_DENIED) {
            errorMessage =
              'Location access denied. Please enable location services in your browser settings to get directions.';
          }
          setDirectionsError(errorMessage);
          setLoadingDirections(false);
          // Fallback to opening in new tab if geolocation fails
          const destinationQuery = getSearchQuery();
          const directionsUrl = `https://www.google.com/maps/dir/current+location/${encodeURIComponent(destinationQuery)}`;
          window.open(directionsUrl, '_blank');
        }
      );
    } else {
      setDirectionsError(
        'Geolocation is not supported by your browser. Directions will open in a new tab.'
      );
      setLoadingDirections(false);
      // Fallback to opening in new tab
      const destinationQuery = getSearchQuery();
      const directionsUrl = `https://www.google.com/maps/dir/current+location/${encodeURIComponent(destinationQuery)}`;
      window.open(directionsUrl, '_blank');
    }
  };

  const renderDirections = (origin, destination) => {
    if (!mapContainerRef.current) {
      setDirectionsError('Map container not found.');
      setLoadingDirections(false);
      return;
    }

    const directionsService = new window.google.maps.DirectionsService();
    const directionsRenderer = new window.google.maps.DirectionsRenderer();

    const map = new window.google.maps.Map(mapContainerRef.current, {
      zoom: 7,
      center: origin, // Center map initially on user's location
    });

    directionsRenderer.setMap(map);

    directionsService.route(
      {
        origin: origin,
        destination: destination,
        travelMode: window.google.maps.TravelMode.DRIVING,
      },
      (response, status) => {
        setLoadingDirections(false);
        if (status === 'OK') {
          directionsRenderer.setDirections(response);
          // NEW: Perform places search around the destination
          const destinationLocation = response.routes[0].legs[0].end_location;
          performPlacesSearch(map, destinationLocation); // Pass map instance and destination
        } else {
          setDirectionsError('Directions request failed due to ' + status);
          console.error('Directions request failed:', status);
        }
      }
    );
  };

  const performPlacesSearch = (map, location) => {
    setLoadingPlaces(true);
    setPlacesError(null);
    setNearbyPlaces([]); // Clear previous places

    const service = new window.google.maps.places.PlacesService(map);
    const request = {
      location: location,
      radius: 1000, // Search within 1000 meters
      type: [
        'bus_station',
        'subway_station',
        'train_station',
        'parking',
        'cafe',
        'restaurant',
        'atm',
      ], // Example types
    };

    service.nearbySearch(request, (results, status) => {
      setLoadingPlaces(false);
      if (status === window.google.maps.places.PlacesServiceStatus.OK && results) {
        setNearbyPlaces(results);
        // Add markers for nearby places
        results.forEach((place) => {
          if (!place.geometry || !place.geometry.location) return;
          const marker = new window.google.maps.Marker({
            map: map,
            position: place.geometry.location,
            title: place.name,
            icon: {
              url: place.icon, // Use place's default icon
              size: new window.google.maps.Size(25, 25),
              origin: new window.google.maps.Point(0, 0),
              anchor: new window.google.maps.Point(12.5, 12.5),
            },
          });
          // Optional: Add info window on marker click
          const infoWindow = new window.google.maps.InfoWindow({
            content: `<div><strong>${place.name}</strong><br>${place.vicinity}</div>`,
          });
          marker.addListener('click', () => {
            infoWindow.open(map, marker);
          });
        });
      } else {
        setPlacesError('Could not find nearby places or Places API request failed: ' + status);
        console.error('Places search failed:', status);
      }
    });
  };

  const closeDirectionsMap = () => {
    setShowDirectionsMap(false);
    setDirectionsError(null);
  };

  const getEmbedUrl = () => {
    const q = getSearchQuery();
    return `https://www.google.com/maps/embed/v1/search?key=${embedKey}&q=${encodeURIComponent(q)}`;
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-card p-6 border border-slate-100">
        <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-grow">
            <label
              htmlFor="city-search"
              className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 px-1"
            >
              Search by City or District (Optional)
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                location_on
              </span>
              <input
                id="city-search"
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="e.g., Pune, Mumbai, Delhi..."
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
              />
            </div>
          </div>
          <Button type="submit" variant="primary" className="h-[46px] px-8">
            Find Offices
          </Button>
          {/* New Button for Get Directions */}
          <Button
            type="button"
            onClick={handleGetDirections}
            variant="secondary"
            className="h-[46px] px-8"
          >
            <span className="material-symbols-outlined text-sm">directions_car</span> Get Directions
          </Button>
        </form>
      </div>

      {/* Embedded Directions Map Section */}
      {showDirectionsMap && (
        <div className="relative bg-white rounded-2xl shadow-card p-4 border border-slate-100 min-h-[400px]">
          <h3 className="font-['Public_Sans'] text-xl font-bold text-on-surface mb-2">
            Directions
          </h3>
          {mapsKeyError && (
            <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4 text-sm">
              {mapsKeyError}
            </div>
          )}
          {loadingDirections && <LoadingOverlay message="Fetching directions..." />}
          {directionsError && (
            <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4 text-sm">
              {directionsError}
            </div>
          )}
          {loadingPlaces && <LoadingOverlay message="Finding nearby places..." />}
          {placesError && (
            <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4 text-sm">{placesError}</div>
          )}
          <div
            ref={mapContainerRef}
            style={{ width: '100%', height: 'calc(100% - 70px)' }}
            className="rounded-xl"
          ></div>
          <Button
            onClick={closeDirectionsMap}
            variant="tertiary"
            className="absolute top-4 right-4"
          >
            <span className="material-symbols-outlined">close</span> Close Map
          </Button>
        </div>
      )}

      <div className="aspect-video w-full rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shadow-inner relative group">
        {(embedKey && !mapsKeyError) ? (
          <iframe
            title="Election Office Map"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
            src={getEmbedUrl()}
          ></iframe>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8">
            {mapsKeyError ? (
              <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4 text-sm">
                {mapsKeyError}
              </div>
            ) : (
              <div className="w-20 h-20 rounded-full bg-slate-200 flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-slate-400 text-4xl">map</span>
              </div>
            )}
            <h3 className="font-['Public_Sans'] text-xl font-bold text-on-surface mb-2">
              Google Maps Discovery
            </h3>
            <p className="text-sm text-on-surface-variant max-w-md mb-8">
              Use Google Maps to find official election offices or help centers near your location.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button onClick={handleSearch} variant="primary" className="flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">open_in_new</span>
                Open Search on Google Maps
              </Button>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <a
          href="https://voters.eci.gov.in/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between p-4 bg-primary text-white rounded-xl hover:bg-indigo-700 transition-colors shadow-md group"
        >
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined">how_to_reg</span>
            <span className="text-sm font-bold uppercase tracking-tight">
              Official Voter Portal
            </span>
          </div>
          <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">
            arrow_forward
          </span>
        </a>
        <a
          href="/assistant?prompt=How%20can%20I%20verify%20my%20official%20polling%20station%20safely%3F"
          className="flex items-center justify-between p-4 bg-white border border-primary text-primary rounded-xl hover:bg-indigo-50 transition-colors shadow-sm group"
        >
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined">smart_toy</span>
            <span className="text-sm font-bold uppercase tracking-tight">
              Verify Polling Station Safely
            </span>
          </div>
          <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">
            arrow_forward
          </span>
        </a>
      </div>
    </div>
  );
}
