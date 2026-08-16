export function serverEnv(name: string): string | undefined {
  // Vercel：运行时 env 存在于 process.env
  if (typeof process !== "undefined" && process.env && name in process.env) {
    return process.env[name];
  }
  // Cloudflare Pages：运行时 env 由适配器暴露到 import.meta.env
  const importMeta = import.meta.env as Record<string, string | undefined>;
  if (importMeta && name in importMeta && importMeta[name] !== undefined) {
    return importMeta[name];
  }
  return undefined;
}
