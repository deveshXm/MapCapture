// src/components/Dashboard.tsx

import React, { useEffect, useState } from "react";

import { UI_CONFIG } from "../constants/config";
import { apiService } from "../services/apiService";

import MapDetailModal from "../components/modal/MapDetailModal";
import DashboardListItem from "../components/pages/Home/CaptureItem";
import PaginationButton from "../components/pages/Home/PaginationButton";
import { notification } from "antd";

const Home: React.FC = () => {
  const [userMaps, setUserMaps] = useState<MapTypes.MapData[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedMap, setSelectedMap] = useState<MapTypes.MapData | null>(null);

  useEffect(() => {
    fetchUserMaps();
  }, []);

  const fetchUserMaps = async () => {
    try {
      const response = await apiService.getUserMaps();
      setUserMaps(response.data);
    } catch (error) {
      console.error("Failed to fetch user maps:", error);
      notification.error({ message: "Could not fetch captures." });
    }
  };

  const totalPages = Math.ceil(userMaps.length / UI_CONFIG.ITEMS_PER_PAGE);
  const paginatedMaps = userMaps.slice((currentPage - 1) * UI_CONFIG.ITEMS_PER_PAGE, currentPage * UI_CONFIG.ITEMS_PER_PAGE);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleMapClick = (map: MapTypes.MapData) => {
    setSelectedMap(map);
  };

  const handleCloseModal = () => {
    setSelectedMap(null);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {paginatedMaps.map((map) => (
          <DashboardListItem map={map} onClick={() => handleMapClick(map)} />
        ))}
      </div>
      <div className="mt-4 flex justify-center">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <PaginationButton page={page} currentPage={currentPage} onClick={() => handlePageChange(page)} />
        ))}
      </div>
      {selectedMap && <MapDetailModal map={selectedMap} onClose={handleCloseModal} />}
    </div>
  );
};

export default Home;
