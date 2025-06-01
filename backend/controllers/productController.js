// Chèn multer để upload file
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/images');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const checkfile = (req, file, cb) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif|webp)$/)) {
    return cb(new Error('Bạn chỉ được upload file ảnh'));
  }
  return cb(null, true);
};

const upload = multer({ storage: storage, fileFilter: checkfile });

// Models
const categories = require('../models/categoryModel');
const products = require('../models/productModel');
const variants = require('../models/variantsModel');
const subcategories = require('../models/subcategoriesModel');

// Lấy tất cả sản phẩm
const getAllProducts = async (req, res) => {
  try {
    const { name, idcate, limit, page, hot } = req.query;

    let query = {};
    let options = {};

    if (name) {
      query.name = new RegExp(name, 'i');
    }

    if (hot) {
      query.hot = parseInt(hot);
    }

    if (idcate) {
      query.categoryId = idcate;
    }

    // Phân trang
    if (limit && !isNaN(limit)) {
      options.limit = parseInt(limit);
    }

    if (page && options.limit && !isNaN(page)) {
      options.skip = (parseInt(page) - 1) * options.limit;
    }

    // Thêm sắp xếp mới nhất lên đầu
    options.sort = { createdAt: -1 };

    const arr = await products
      .find(query, null, options)
      .populate('categoryId', 'name description')
      .populate('subcategoryId', 'name')
      .populate({
        path: 'variants',
        select: 'size price quantity',
      });

    res.json(arr);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};


// Lấy sản phẩm theo ID
const getProductById = async (req, res) => {
  try {
    const product = await products
      .findById(req.params.id)
      .populate('categoryId')        
      .populate('subcategoryId')    
      .populate('variants');
    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// Thêm sản phẩm
const addPro = [
  upload.single('img'),
  async (req, res) => {
    try {
      const product = req.body;

      // Ép kiểu price về số (Int32)
      product.price = Number(product.price);
      if (isNaN(product.price)) {
        return res.status(400).json({ message: "Giá sản phẩm không hợp lệ" });
      }

      if (req.file) {
        product.images = [req.file.originalname];
      } else {
        product.images = [];
      }

      product.createdAt = new Date();

      const category = await categories.findById(product.categoryId);
      if (!category) throw new Error('Danh mục không tồn tại');

      const newProduct = new products(product);
      const data = await newProduct.save();

      // Thêm variant cho sản phẩm mới
      if (req.body.size && req.body.quantity) {
        const variant = new variants({
          productId: data._id,
          size: req.body.size,
          quantity: req.body.quantity,
          price: product.price // hoặc req.body.price nếu muốn variant có giá riêng
        });
        await variant.save();
      }

      res.json(data);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: error.message });
    }
  },
];

// Sửa sản phẩm
const editPro = [
  upload.single('img'),
  async (req, res) => {
    try {
      const product = req.body;

      if (req.file) {
        product.images = [req.file.originalname]; // ✅ đúng field name
      }

      const category = await categories.findById(product.categoryId);
      if (!category) {
        throw new Error('Danh mục không tồn tại');
      }

      const data = await products.findByIdAndUpdate(
        req.params.id,
        product,
        { new: true }
      );

      res.json(data);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: error.message });
    }
  },
];

// Xoá sản phẩm
const deletePro = async (req, res) => {
  try {
    const data = await products.findByIdAndDelete(req.params.id);
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// Xuất các hàm controller
module.exports = {
  getAllProducts,
  getProductById,
  addPro,
  editPro,
  deletePro,
};
