// src/components/TopRegions.tsx

import React, { useEffect, useState } from "react";
import { apiService } from "../services/apiService";
import { Title } from "../components/ui/Title";
import { notification } from "antd";

interface TopRegion {
  region: string;
  count: number;
}

const TopRegions: React.FC = () => {
  const [topRegions, setTopRegions] = useState<TopRegion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
    <div className="h-full flex flex-col">
      {topRegions?.length ? (
        topRegions.map((region) => (
          <Title className="mb-2">
            {region.region}:{region.count} captures
          </Title>
        ))
      ) : loading ? (
        <div className="flex justify-center items-center flex-1">
          <Title>Loading</Title>
        </div>
      ) : (
        <div className="flex justify-center items-center flex-1">
          <Title>No top regions found! Why don't you search something!</Title>
        </div>
      )}
    </div>
  );
};

export default TopRegions;
