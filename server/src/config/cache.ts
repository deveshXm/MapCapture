import { fetchTopRegions, fetchTopRegions24H } from "../utils/topRegions";
import { topRegionsQueue, topRegions24HQueue } from "./bull";
import { redisClient } from "./redis";

const CACHE_EXPIRATION = 3600; // 1 hour

export async function cacheInit() {
  // Background job to update top regions
  topRegionsQueue.process(async () => {
    const topRegions = await fetchTopRegions();
    await redisClient.set("topRegions", JSON.stringify(topRegions), {
      EX: CACHE_EXPIRATION,
    });
  });

  topRegions24HQueue.process(async () => {
    const topRegions24H = await fetchTopRegions24H();
    await redisClient.set("topRegions24H", JSON.stringify(topRegions24H), {
      EX: CACHE_EXPIRATION,
    });
  });

  // Remove all existing repeatable jobs
  await removeExistingRepeatableJobs(topRegionsQueue);
  await removeExistingRepeatableJobs(topRegions24HQueue);

  // Schedule job to run every 5 minutes
  await topRegionsQueue.add(
    {},
    {
      repeat: {
        cron: "*/5 * * * *",
      },
      jobId: "topRegionsJob",
    }
  );

  // Schedule task to run every 5 seconds
  await topRegions24HQueue.add(
    {},
    {
      repeat: {
        every: 5000,
      },
      jobId: "topRegions24HJob",
    }
  );
}

async function removeExistingRepeatableJobs(queue: any) {
  const repeatableJobs = await queue.getRepeatableJobs();
  for (const job of repeatableJobs) {
    await queue.removeRepeatableByKey(job.key);
  }
}
