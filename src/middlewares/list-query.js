module.exports = (req, res, next) => {
  const page = Math.max(parseInt(req.query.page) || 0, 0);
  const size = Math.min(parseInt(req.query.size) || 20, 100);
  const offset = page * size;

  let sortField = "createdAt";
  let sortDirection = "DESC";

  if (req.query.sort) {
    const parts = req.query.sort.split(",");

    if (parts[0]) {
      sortField = parts[0];
    }

    if (parts[1] && ["ASC", "DESC"].includes(parts[1].toUpperCase())) {
      sortDirection = parts[1].toUpperCase();
    }
  }

  const filters = { ...req.query };
  delete filters.page;
  delete filters.size;
  delete filters.sort;

  req.listQuery = {
    page,
    size,
    offset,
    sortField,
    sortDirection,
    filters,
  };

  next();
};
