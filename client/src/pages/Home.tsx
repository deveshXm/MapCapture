import { notification } from "antd";
import React, { useEffect, useState } from "react";

import { UI_CONFIG } from "../constants/config";
import { apiService } from "../services/apiService";

import { Title } from "../components/ui/Title";
import MapDetailModal from "../components/modal/MapDetailModal";
import DashboardListItem from "../components/pages/Home/CaptureItem";
import PaginationButton from "../components/pages/Home/PaginationButton";

const Home: React.FC = () => {
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [userMaps, setUserMaps] = useState<MapTypes.MapData[]>([]);
  const [selectedMap, setSelectedMap] = useState<MapTypes.MapData | null>(null);

  useEffect(() => {
    console.log("second");
    fetchUserMaps(currentPage);
  }, [currentPage]);

  const fetchUserMaps = async (page: number) => {
    try {
      setLoading(true);
      const response = await apiService.getUserMaps(page, UI_CONFIG.ITEMS_PER_PAGE);
      setUserMaps(response.data);
      setTotalPages(response.pagination.totalPages);
    } catch (error) {
      console.log(error);
      notification.error({ message: "Couldn't fetch maps" });
    } finally {
      setLoading(false);
    }
  };

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
    <div className="h-full">
      {userMaps.length ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {userMaps.map((map) => (
            <DashboardListItem key={map._id} map={map} onClick={() => handleMapClick(map)} />
          ))}
        </div>
      ) : loading ? (
        <div className="flex w-full h-full">
          <Title className="m-auto">Loading</Title>
        </div>
      ) : (
        <div className="flex w-full h-full">
          <Title className="m-auto">No Captures!</Title>
        </div>
      )}
      <div className="mt-4 flex justify-center">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <PaginationButton key={page} page={page} currentPage={currentPage} onClick={() => handlePageChange(page)} />
        ))}
      </div>
      {selectedMap && <MapDetailModal map={selectedMap} onClose={handleCloseModal} />}
    </div>
  );
};

export default Home;
