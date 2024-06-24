import { notification } from "antd";
import React, { useEffect, useState } from "react";

import { Title } from "../components/ui/Title";
import RegionMapView from "../components/pages/TopRegions.tsx/RegionMapView";

import { apiService } from "../services/apiService";

interface TrendingRegions {
  geohash: string;
  region: { latitude: number; longitude: number };
  count: number;
}

const TrendingRegions: React.FC = () => {
  const [trendingRegions, setTrendingRegions] = useState<TrendingRegions[]>([]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      fetchTopRegions();
    }, 5000); // Poll every 5 seconds

    fetchTopRegions();

    // Cleanup function to clear the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, []);

  const fetchTopRegions = async () => {
    try {
      const response = await apiService.getTopRegions24H();
      setTrendingRegions(response.data);
    } catch (error) {
      notification.error({ message: "Couldn't fetch top regions." });
    }
  };

  return (
    <div className="h-full flex flex-col w-full md:w-[60%] mb-20 mt-20">
      <Title className="mb-4 mx-auto">Realtime Trending Regions (Last 24h)</Title>
      <div className="space-y-5">
        {trendingRegions.map((region, index) => (
          <div>
            <Title key={index} className="mb-2">
              {`${region.count} Captures`}
            </Title>
            <RegionMapView geohashString={region.geohash} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrendingRegions;
