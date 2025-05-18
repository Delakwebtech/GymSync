const advancedResults = (model, include = []) => async (req, res, next) => {
  try {
    // Copy req.query
    const reqQuery = { ...req.query };

    // Fields to exclude from filtering
    const removeFields = ['select', 'sort', 'page', 'limit'];
    removeFields.forEach(param => delete reqQuery[param]);

    // Convert reqQuery to Sequelize-compatible where clause
    let queryStr = JSON.stringify(reqQuery);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);
    const where = JSON.parse(queryStr);

    // Build query options
    const options = {
      where,
      include,
    };

    // Select specific fields
    if (req.query.select) {
      options.attributes = req.query.select.split(',');
    }

    // Sort
    if (req.query.sort) {
      const sortFields = req.query.sort.split(',').map(field => [field]);
      options.order = sortFields;
    } else {
      options.order = [['createdAt', 'DESC']];
    }

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 25;
    const offset = (page - 1) * limit;

    options.limit = limit;
    options.offset = offset;

    // Execute query
    const results = await model.findAll(options);
    const total = await model.count({ where });

    // Pagination metadata
    const pagination = {};
    if (offset + limit < total) {
      pagination.next = {
        page: page + 1,
        limit,
      };
    }
    if (offset > 0) {
      pagination.prev = {
        page: page - 1,
        limit,
      };
    }

    // Send results
    res.advancedResults = {
      success: true,
      count: results.length,
      pagination,
      data: results,
    };

    next();
  } catch (err) {
    next(err);
  }
};

module.exports = advancedResults;