import { createContext, useEffect, useState } from "react";
import { getTours } from "../services/api";

const TourContext = createContext({
  tours: [],
  loading: true,
});

const TourProvider = ({ children }) => {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchTours = async () => {
      try {
        const response = await getTours();
        setTours(response.data.data.tours);
      } catch (error) {
        console.error("Failed to fetch tours:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTours();
  }, []);

  return (
    <TourContext.Provider value={{ tours, loading }}>
      {children}
    </TourContext.Provider>
  );
};

export { TourContext, TourProvider };
