// Keep an explicit empty course record so legacy progress cannot be imported again.
export function clearLearningRecords(storage: Pick<Storage, "setItem" | "removeItem">) {
  const progress = { learned: [] as string[], mistakes: [] as string[], lastUnit: 1 };
  storage.setItem("kids-box-book1-progress-v1", JSON.stringify(progress));
  for (const key of [
    "kids-box-book-activity-progress-v1",
    "little-safari-progress-v1",
    "kids-box-reader-page-v1",
  ]) storage.removeItem(key);
  return progress;
}
