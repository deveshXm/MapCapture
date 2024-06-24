// src/components/TopRegions.tsx

import React, { useEffect, useState } from "react";
import { apiService } from "../services/apiService";
import { Title } from "../components/ui/Title";
import { notification } from "antd";
import RegionMapView from "../components/pages/TopRegions.tsx/RegionMapView";

interface TopRegion {
  geohash: string;
  region: [number, number, number, number];
  count: number;
}

const TopRegions: React.FC = () => {
  const [topRegions, setTopRegions] = useState<TopRegion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch immediately on mount
    fetchTopRegions();
  }, []);

  const fetchTopRegions = async () => {
    try {
      setLoading(true);
      const response = await apiService.getTopRegions();
      setTopRegions(response.data);
    } catch (error) {
      notification.error({ message: "Couldn't fetch top regions." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col w-full md:w-[60%] mb-20 mt-20">
      <Title className="mb-4 mx-auto">All Time Top 3 Regions</Title>
      {loading ? (
        <div className="flex w-full h-full justify-center items-center">
          <Title className="m-auto">Loading</Title>
        </div>
      ) : (
        <div className="space-y-5">
          {topRegions.map((region, index) => (
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

export default TopRegions;
