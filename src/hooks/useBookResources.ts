import { useEffect, useState } from "react";

type ResourceKind = "image" | "audio";
type StoredResource = { key: string; file: Blob; name: string };
function database(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("kids-box-private-book-resources", 1);
    request.onupgradeneeded = () => {
      request.result.createObjectStore("resources", { keyPath: "key" });
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}
async function readResource(key: string): Promise<StoredResource | undefined> {
  const db = await database();
  try {
    return await new Promise((resolve, reject) => {
      const request = db
        .transaction("resources", "readonly")
        .objectStore("resources")
        .get(key);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  } finally {
    db.close();
  }
}
async function writeResource(resource: StoredResource): Promise<void> {
  const db = await database();
  try {
    await new Promise<void>((resolve, reject) => {
      const transaction = db.transaction("resources", "readwrite");
      transaction.objectStore("resources").put(resource);
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
      transaction.onabort = () => reject(transaction.error);
    });
  } finally {
    db.close();
  }
}
export function useBookResources(resourceKey: string) {
  const [revision, setRevision] = useState(0);
  const [resources, setResources] = useState<
    Partial<Record<ResourceKind, StoredResource>>
  >({});
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [urls, setUrls] = useState<Partial<Record<ResourceKind, string>>>({});
  useEffect(() => {
    let active = true;
    setResources({});
    setError("");
    setLoading(true);
    Promise.all(
      (["image", "audio"] as const).map(
        async (kind) =>
          [kind, await readResource(`${resourceKey}:${kind}`)] as const,
      ),
    )
      .then((result) => {
        if (active) setResources(Object.fromEntries(result));
      })
      .catch(() => {
        if (active)
          setError("Resources on this device could not be read. Check browser storage permissions.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [resourceKey, revision]);
  useEffect(() => {
    const next: Partial<Record<ResourceKind, string>> = {};
    for (const kind of ["image", "audio"] as const)
      if (resources[kind])
        next[kind] = URL.createObjectURL(resources[kind].file);
    setUrls(next);
    return () => {
      Object.values(next).forEach((url) => URL.revokeObjectURL(url));
    };
  }, [resources]);
  const add = async (kind: ResourceKind, file: File) => {
    if (file.size > (kind === "image" ? 15 : 60) * 1024 * 1024) {
      setError(
        kind === "image"
          ? "Please choose an image smaller than 15 MB."
          : "Please choose an audio file smaller than 60 MB.",
      );
      return;
    }
    setSaving(true);
    setError("");
    try {
      await writeResource({
        key: `${resourceKey}:${kind}`,
        file,
        name: file.name,
      });
      setRevision((value) => value + 1);
    } catch {
      setError("Could not save. The device may be out of storage. Existing resources were kept.");
    } finally {
      setSaving(false);
    }
  };
  return { resources, urls, add, error, saving, loading };
}
