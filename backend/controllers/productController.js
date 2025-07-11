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
const subcategories = require('../models/subcategoryModel');

// Lấy tất cả sản phẩm
const getAllProducts = async (req, res) => {
  try {
    const { name, idcate, idsubcate, limit, page, hot } = req.query;

    let query = {};
    let options = {};

    if (name) {
      query.name = new RegExp(name, 'i');
    }

    if (hot) {
      query.hot = parseInt(hot);
    }

    if (idsubcate) {
      query.subcategoryId = idsubcate;
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
    if (!product) return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
    res.json(product); // phải trả về đầy đủ trường images
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// Thêm sản phẩm
const addPro = [
  upload.fields([
    { name: 'img', maxCount: 1 },
    { name: 'thumbnails', maxCount: 10 }
  ]),
  async (req, res) => {
    try {
      const product = req.body;

      // Ép kiểu price về số (Int32)
      product.price = Number(product.price);
      if (isNaN(product.price)) {
        return res.status(400).json({ message: "Giá sản phẩm không hợp lệ" });
      }

      product.images = [];
      if (req.files['img']) product.images.push(req.files['img'][0].originalname);
      if (req.files['thumbnails']) {
        product.images = product.images.concat(req.files['thumbnails'].map(f => f.originalname));
      }

      product.createdAt = new Date();

      // KIỂM TRA TRƯỜNG BẮT BUỘC
      if (!product.name || !product.categoryId || product.images.length === 0) {
        return res.status(400).json({ message: "Thiếu trường bắt buộc (tên, danh mục, ảnh)" });
      }

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
          price: product.price
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
  upload.fields([
    { name: 'img', maxCount: 1 },
    { name: 'thumbnails', maxCount: 10 }
  ]),
  async (req, res) => {
    try {
      const product = req.body;

      // Parse oldThumbnails từ frontend
      let oldThumbnails = [];
      if (req.body.oldThumbnails) {
        try {
          oldThumbnails = JSON.parse(req.body.oldThumbnails);
        } catch (e) {
          oldThumbnails = [];
        }
      }

      // Xử lý ảnh chính
      let images = [];
      if (req.files['img']) {
        images.push(req.files['img'][0].originalname);
      } else if (req.body.image) {
        images.push(req.body.image.replace(/^.*[\\/]/, ""));
      }

      // Thêm các thumbnail cũ giữ lại
      if (Array.isArray(oldThumbnails)) {
        images = images.concat(oldThumbnails);
      }

      // Thêm các thumbnail mới upload
      if (req.files['thumbnails']) {
        images = images.concat(req.files['thumbnails'].map(f => f.originalname));
      }

      // Đảm bảo luôn có ít nhất 1 ảnh
      if (images.length === 0) {
        return res.status(400).json({ message: "Sản phẩm phải có ít nhất 1 ảnh" });
      }

      // Ép kiểu và kiểm tra các trường bắt buộc
      const updateData = {
        name: product.name,
        description: product.description,
        price: Number(product.price),
        categoryId: product.categoryId,
        status: product.status,
        images: images,
      };

      // Kiểm tra trường bắt buộc
      if (!updateData.name || isNaN(updateData.price) || !updateData.categoryId) {
        return res.status(400).json({ message: "Thiếu trường bắt buộc" });
      }

      // Cập nhật sản phẩm
      const data = await products.findByIdAndUpdate(
        req.params.id,
        updateData,
        { new: true }
      );

      // --- XỬ LÝ VARIANTS ---
      if (req.body.variants) {
        let variantsArr = req.body.variants;
        if (typeof variantsArr === "string") {
          variantsArr = JSON.parse(variantsArr);
        }
        // Xóa hết variants cũ của sản phẩm này
        await variants.deleteMany({ productId: req.params.id });
        // Thêm lại variants mới
        for (const v of variantsArr) {
          await variants.create({
            productId: req.params.id,
            size: v.size,
            quantity: v.quantity,
            price: v.price // LẤY GIÁ TỪ BIẾN THỂ
          });
        }
      }

      if (!data) {
        return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
      }

      res.json(data);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: error.message });
    }
  },
];

// // Xoá sản phẩm
// const deletePro = async (req, res) => {
//   try {
//     // Xóa sản phẩm
//     const data = await products.findByIdAndDelete(req.params.id);

//     // Xóa tất cả variants liên quan đến sản phẩm này
//     await variants.deleteMany({ productId: req.params.id });

//     res.json(data);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: error.message });
//   }
// };

// Xuất các hàm controller
module.exports = {
  getAllProducts,
  getProductById,
  addPro,
  editPro,
  // deletePro,
};
