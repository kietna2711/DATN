//chèn multer để upload file
const multer = require('multer');
const storage = multer.diskStorage({
  destination: function(req, file, cb){
    cb(null, './public/images')
  },
  filename: function(req, file, cb){
    cb(null, file.originalname)
  }
})
const checkfile = (req, file, cb) => {
  if(!file.originalname.match(/\.(jpg|jpeg|png|gif|webp)$/)){
    return cb(new Error('Bạn chỉ được upload file ảnh'))
  }
  return cb(null, true)
}
const upload = multer({storage: storage, fileFilter: checkfile})

const categories = require('../models/categoryModel');
const products = require('../models/productModel');

const getAllProducts = async (req, res) => {
    try {
        const { name, idcate, limit, sort, page, hot } = req.query;
        
        let query = {};
        let options = {};

        if (name) {
            query.tenSP = new RegExp(name, 'i');
        }

        if (hot) {
            query.hot = parseInt(hot);
        }

        if (idcate) {
            query.danhMuc_id = idcate;
        }

        if (limit) {
            options.limit = parseInt(limit);
        }

        if (sort) {
            options.sort = { price: sort === 'asc' ? 1 : -1 };
        }

        if (page && options.limit) {
            options.skip = (parseInt(page) - 1) * options.limit;
        }

        const arr = await products.find(query, null, options)
            .populate('danhMuc_id', 'tenDanhMuc');
        res.json(arr);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
}


const getProductById = async (req, res) => {
    try {
        const product = await products.findById(req.params.id);
        res.json(product);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
}

//Thêm sản phẩm
const addPro =[upload.single('img'), async (req, res) => {
    try {
        //Lấy dữ liệu từ form gửi tới
        const product= req.body;
        //Lẩy tên ảnh từ file ảnh gửi đến
        product.img = req.file.originalname;
        console.log(product);
        //Tạo 1 instance của productModel
        const newProduct= new products(product);
        //kiểm tra iddanh mục có tồn tại ko 
        const category = await categories.findById(product.categoryId);
        if(!category){
            throw new Error('Danh mục ko tồn tại')
        }
        //Lưu vào database 
        const data= await newProduct.save();
        res.json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
}
]

//Sửa sản phẩm
const editPro =[upload.single('img'), async (req, res) => {
    try {
        const product= req.body;
        if(req.file){
              product.img = req.file.originalname;
        }
        const category = await categories.findById(product.categoryId);
        if(!category){
            throw new Error('Danh mục ko tồn tại')
        }
        const data= await products.findByIdAndUpdate(
            req.params.id,product,{new:true}
        )
        res.json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
}]

//Xóa sản phẩm
const deletePro = async (req, res) => {
    try {
        const data= await products.findByIdAndDelete(req.params.id);
        res.json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
}

module.exports = {
    getAllProducts, getProductById,addPro,editPro,deletePro
};
