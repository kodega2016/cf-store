const routes = require("express").Router();
const { KV } = require("./model");

routes.get("/kv", async (req, res) => {
  try {
    const kvs = await KV.findAll();
    res.status(200).json({
      success: true,
      data: kvs,
      message: "Key-Value pairs fetched successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      data: null,
      message: "Error fetching Key-Value pairs",
    });
  }
});

routes.get("/keys/:key", async (req, res) => {
  const { key } = req.params;
  try {
    const singleKey = await KV.findOne({ where: { key } });
    if (!singleKey) {
      return res.status(404).json({
        success: false,
        data: null,
        message: "key not found.",
      });
    }
    res.status(200).json({
      success: true,
      data: singleKey,
      message: "key fetched successfully.",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      data: null,
      message: err.message,
    });
  }
});

routes.post("/keys/:key", async (req, res) => {
  const { key, value } = req.body;
  try {
    if (!key || !value) {
      return res.status(400).json({
        success: false,
        data: null,
        message: "both key and value are required.",
      });
    }

    // check if key is already exist
    const existingKey = await KV.findOne({ where: { key } });
    if (existingKey) {
      return res.status(500).json({
        success: false,
        data: null,
        message: "That key is already exists.",
      });
    }

    const createdKey = await KV.create({ key, value });
    if (!createdKey) {
      return res.status(404).json({
        success: false,
        data: null,
        message: "key not found.",
      });
    }
    res.status(200).json({
      success: true,
      data: createdKey,
      message: "key fetched successfully.",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      data: null,
      message: err.message,
    });
  }
});

routes.put("/keys/:key", async (req, res) => {
  const { key, value } = req.body;
  try {
    if (!key || !value) {
      return res.status(400).json({
        success: false,
        data: null,
        message: "both key and value are required.",
      });
    }

    // check if key is already exist
    const existingKey = await KV.findOne({ where: { key } });
    if (!existingKey) {
      return res.status(500).json({
        success: false,
        data: null,
        message: "key not found",
      });
    }

    const updatedKey = await KV.update(
      { value },
      {
        where: {
          key: key,
        },
      },
    );
    if (!updatedKey) {
      return res.status(404).json({
        success: false,
        data: null,
        message: "key not found.",
      });
    }

    res.status(200).json({
      success: true,
      data: updatedKey,
      message: "key updated successfully.",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      data: null,
      message: err.message,
    });
  }
});

routes.delete("/keys/:key", async (req, res) => {
  const { key, value } = req.body;
  try {
    // check if key is already exist
    const existingKey = await KV.findOne({ where: { key } });
    if (!existingKey) {
      return res.status(500).json({
        success: false,
        data: null,
        message: "key not found",
      });
    }

    await User.destroy({ where: { key } });
    res.status(200).json({
      success: true,
      data: null,
      message: "key deleted successfully.",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      data: null,
      message: err.message,
    });
  }
});

module.exports = routes;
