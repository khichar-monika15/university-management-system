import { useEffect } from 'react';
import { toast } from 'react-toastify';
import { toastErrorObject } from './utility/toasts';
import { fetchResponse } from './api/service';

export default function Activator() {
  useEffect(() => {
    async function activator() {
      try {
        const resData = await fetchResponse(process.env.REACT_APP_API_URL, 0, null);
        if (!resData) toast.error('Check your internet connection.', toastErrorObject);
      } catch (error) {
        toast.error('Server unavailable. Check your internet connection.', toastErrorObject);
      }
    }
    activator();
    const interval = setInterval(activator, 30000);
    return () => clearInterval(interval);
  }, []);

  return null;
}
