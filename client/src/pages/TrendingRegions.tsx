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
  const [loading, setLoading] = useState(true);
  const [trendingRegions, setTrendingRegions] = useState<TrendingRegions[]>([]);

  useEffect(() => {
    fetchTrendingRegions();
  }, []);

  const fetchTrendingRegions = async () => {
    try {
      setLoading(true);
      const response = await apiService.getTopRegions24H();
      setTrendingRegions(response.data);
    } catch (error) {
      notification.error({ message: "Couldn't fetch top regions." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col w-full md:w-[60%] mb-20 mt-20">
      <Title className="mb-4 mx-auto">Realtime Trending Regions (Last 24h)</Title>
      {loading ? (
        <div className="flex w-full h-full justify-center items-center">
          <Title className="m-auto">Loading</Title>
        </div>
      ) : (
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
      )}
    </div>
  );
};

export default TrendingRegions;
