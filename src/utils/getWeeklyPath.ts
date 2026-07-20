import { WEEKLY_PATH } from "@/content.config";
import { slugifyStr } from "./slugify";

export function getWeeklyPath(
  id: string,
  filePath: string | undefined,
  includeBase = true
) {
  if (!filePath) return [includeBase ? "/weekly" : "", slugifyStr(id)].join("/");

  const pathSegments = filePath
    .replaceAll(WEEKLY_PATH, "")
    .split("/")
    .filter(path => path !== "")
    .filter(path => !path.startsWith("_"))
    .slice(0, -1)
    .map(segment => slugifyStr(segment));

  const basePath = includeBase ? "/weekly" : "";

  const weeklyId = id.split("/");
  const slug = weeklyId.length > 0 ? weeklyId[weeklyId.length - 1] : "";

  if (!pathSegments || pathSegments.length < 1) {
    return [basePath, slug].join("/");
  }

  return [basePath, ...pathSegments, slug].join("/");
}
