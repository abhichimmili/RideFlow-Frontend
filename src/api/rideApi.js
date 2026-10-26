import axiosInstance from './axiosInstance';

export async function getMyRides() {
  const response = await axiosInstance.get('/api/rides/my-rides');
  return response.data;
}

export async function getRideById(rideId) {
  const response = await axiosInstance.get(`/api/rides/${rideId}`);
  return response.data;
}

export async function createRide(rideData) {
  const response = await axiosInstance.post('/api/rides', rideData);
  return response.data;
}

export async function cancelRide(rideId) {
  const response = await axiosInstance.patch(`/api/rides/${rideId}/cancel`);

  return response.data;
}
