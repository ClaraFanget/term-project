module.exports = (payload) => {
  const { content, page, size, totalElements, sortField, sortDirection } =
    payload;

  return {
    content,
    page,
    size,
    totalElements,
    totalPages: Math.ceil(totalElements / size),
    sort: `${sortField},${sortDirection}`,
  };
};
