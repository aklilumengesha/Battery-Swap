'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import ProducerRoute from '@/components/layout/ProducerRoute';
import { ProducerService } from '@/services/producer.service';
import { useQueryClient } from '@tanstack/react-query';
import { routes } from '@/routes';
import { EnvironmentOutlined, ThunderboltFilled } from '@ant-design/icons';

export default function CreateStationPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [name, setName] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [detectingLocation, setDetectingLocation] = useState(false);

  const detectLocation = () => {
    setDetectingLocation(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLatitude(pos.coords.latitude.toString());
          setLongitude(pos.coords.longitude.toString());
          setDetectingLocation(false);
        },
        () => {
          setError('Could not detect location');
          setDetectingLocation(false);
        }
      );
    }
  };

  const handleSubmit = async () => {
    setError('');

    if (!name.trim()) {
      setError('Station name is required');
      return;
    }

    if (!latitude || !longitude) {
      setError('Location is required');
      return;
    }

    setIsLoading(true);
    try {
      const res = await ProducerService.createStation({
        name: name.trim(),
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
      });

      if (res.data?.success || res.status === 201) {
        // Invalidate stations cache
        queryClient.invalidateQueries({
          queryKey: ['producer', 'stations'],
        });
        router.push(routes.PRODUCER_STATIONS);
      } else {
        setError(res.data?.message || 'Failed to create station');
      }
    } catch (e) {
      setError('Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ProducerRoute>
      <DashboardLayout title="Add Station">
        <div className="w-full max-w-2xl">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors"
            >
              ← Back
            </button>
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {/* Card Header */}
            <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 p-6">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl" />
              <div className="relative z-10 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center">
                  <ThunderboltFilled className="text-white" />
                </div>
                <div>
                  <h2 className="text-white font-bold text-lg">New Station</h2>
                  <p className="text-gray-400 text-sm">
                    Add a battery swap station
                  </p>
                </div>
              </div>
            </div>

            {/* Form Fields */}
            <div className="p-6 space-y-5">
              {/* Station Name */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Station Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Beach Side Station"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-900 bg-gray-50 focus:outline-none focus:border-gray-400 transition-colors"
                />
              </div>

              {/* Location */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Location *
                  </label>
                  <button
                    onClick={detectLocation}
                    disabled={detectingLocation}
                    className="flex items-center gap-1 text-xs text-gray-900 font-medium hover:text-gray-600 transition-colors"
                  >
                    <EnvironmentOutlined />
                    {detectingLocation ? 'Detecting...' : 'Use My Location'}
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-gray-400 mb-1.5">Latitude</p>
                    <input
                      type="number"
                      step="any"
                      placeholder="e.g. 9.0192"
                      value={latitude}
                      onChange={(e) => setLatitude(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-900 bg-gray-50 focus:outline-none focus:border-gray-400 transition-colors"
                    />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-1.5">Longitude</p>
                    <input
                      type="number"
                      step="any"
                      placeholder="e.g. 38.7469"
                      value={longitude}
                      onChange={(e) => setLongitude(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-900 bg-gray-50 focus:outline-none focus:border-gray-400 transition-colors"
                    />
                  </div>
                </div>

                {/* Location preview */}
                {latitude && longitude && (
                  <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-green-50 border border-green-100">
                    <EnvironmentOutlined className="text-green-500 text-sm" />
                    <p className="text-xs text-green-700">
                      Location set: {parseFloat(latitude).toFixed(4)},{' '}
                      {parseFloat(longitude).toFixed(4)}
                    </p>
                    <a
                      href={`https://maps.google.com/?q=${latitude},${longitude}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-auto text-xs text-green-600 underline underline-offset-2"
                    >
                      Preview
                    </a>
                  </div>
                )}
              </div>

              {/* Error */}
              {error && (
                <div className="px-4 py-3 rounded-xl bg-red-50 border border-red-100 text-sm text-red-600">
                  ✗ {error}
                </div>
              )}

              {/* Submit */}
              <button
                onClick={handleSubmit}
                disabled={isLoading}
                className="w-full py-4 rounded-xl bg-gray-900 text-white text-sm font-semibold hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? 'Creating Station...' : 'Create Station'}
              </button>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </ProducerRoute>
  );
}
