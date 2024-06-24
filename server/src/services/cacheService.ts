import { topRegionsQueue } from "../config/bull";
import { getTopRegions } from "./mapService";

export function cacheInit() {
  // Background job to update top regions
  topRegionsQueue.process(async () => {
    await getTopRegions();
  });

  // Schedule job to run every 5 minutes
  topRegionsQueue.add({}, { repeat: { cron: "*/5 * * * *" } });
}
