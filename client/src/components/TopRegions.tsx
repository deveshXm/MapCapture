// src/components/TopRegions.tsx

import React, { useEffect, useState } from "react";
import { apiService } from "../services/apiService";

interface TopRegion {
  region: string;
  count: number;
}

const TopRegions: React.FC = () => {
  const [topRegions, setTopRegions] = useState<TopRegion[]>([]);

  useEffect(() => {
    fetchTopRegions();
  }, []);

  const fetchTopRegions = async () => {
    try {
      const response = await apiService.getTopRegions();
      setTopRegions(response.data);
    } catch (error) {
      console.error("Failed to fetch top regions:", error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Top Captured Regions</h2>
      <ul>
        {topRegions.map((region, index) => (
          <li key={index} className="mb-2">
            <span className="font-bold">{region.region}:</span> {region.count} captures
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TopRegions;
