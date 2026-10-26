import { useCallback, useEffect, useState } from 'react';
import { getMyRides } from '../api/rideApi';

function normalizeRideList(data) {
  if (Array.isArray(data)) {
    return data;
  }

  if (Array.isArray(data?.content)) {
    return data.content;
  }

  if (Array.isArray(data?.rides)) {
    return data.rides;
  }

  return [];
}

export function useRides() {
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const refreshRides = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const data = await getMyRides();
      setRides(normalizeRideList(data));
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          err.message ||
          'Unable to load your rides.'
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshRides();
  }, [refreshRides]);

  return {
    rides,
    setRides,
    loading,
    error,
    refreshRides,
  };
}
