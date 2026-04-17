import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from './components/Sidebar';
import DashboardMap from './components/MapContainer';

const App = () => {
  const [data, setData] = useState([]);
  const [filters, setFilters] = useState({ sourceType: '', search: '' });
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get('https://intelfusion-backend.onrender.com/api/data', {
        params: filters
      });
      setData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [filters]);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://intelfusion-backend.onrender.com/api/data/${id}`);
      fetchData(); // Refresh the map instantly
    } catch (error) {
      console.error("Error deleting data:", error);
    }
  };

  return (
    <div className="w-screen h-screen flex bg-dark text-white font-sans overflow-hidden">
      
      <Sidebar 
        filters={filters} 
        setFilters={setFilters} 
        refreshData={fetchData} 
      />

      <main className="flex-1 relative h-full">
        {/* Background ambient gradient */}
        <div className="absolute inset-0 bg-gradient-to-tr from-cyan-900/20 to-transparent pointer-events-none z-10 mix-blend-screen"></div>
        
        <DashboardMap data={data} onDelete={handleDelete} isLoading={isLoading} />
      </main>

    </div>
  );
}

export default App;
