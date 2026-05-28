// Pagefind shim — 在构建时提供一个空实现，运行时由真正的 pagefind 覆盖
export const Pagefind = {
  new: async () => ({
    search: async () => ({ results: [] }),
    filters: null,
  }),
};
