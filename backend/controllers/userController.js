//chèn multer để upload file
const multer = require('multer');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/images')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})
const checkfile = (req, file, cb) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif|webp)$/)) {
        return cb(new Error('Bạn chỉ được upload file ảnh'))
    }
    return cb(null, true)
}
const upload = multer({ storage: storage, fileFilter: checkfile })

////////////////////////////
const userModel = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const register = async (req, res) => {
    try {
        // Kiểm tra email đã tồn tại chưa bằng hàm findOne()
        const checkUser = await userModel.findOne({
            email: req.body.email
        });
        if (checkUser) {
            throw new Error('Email đã tồn tại');
        }
        // Mã hóa mật khẩu bằng bcrypt
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(req.body.password, salt);
        // Tạo một instance mới của userModel
        const newUser = new userModel({
            email: req.body.email,
            password: hashPassword,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            username: req.body.username,
        });
        // Lưu vào database bằng hàm save()
        const data = await newUser.save();

        // Tạo token cho user mới
        // Tạo token cho user mới (register)
        const token = jwt.sign({
            id: data._id,
            email: data.email,
            role: data.role,
            username: data.username 
        }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Trả về cả user và token
        res.json({ user: data, token });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


const login = [upload.single('img'), async (req, res) => {
    try {
        const checkUser = await userModel.findOne({
            email: req.body.email
        });
        if (!checkUser) {
            throw new Error('Email không tồn tại');
        }
        const isMatch = await bcrypt.compare(req.body.password, checkUser.password);
        if (!isMatch) {
            throw new Error('Mật khẩu không đúng');
        }
        const token = jwt.sign({
            id: checkUser._id,
            email: checkUser.email,
            role: checkUser.role,
            username: checkUser.username
        }, process.env.JWT_SECRET, {
            expiresIn: '1h'
        });
        // Không trả về password!
        const { password, ...userWithoutPassword } = checkUser.toObject();
        res.json({ user: userWithoutPassword, token });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
]

// Middleware xác thực
const verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.slice(7);
    if (!token) {
        return res.status(403).json({ message: 'Không có token' });
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            if (err.name === 'TokenExpiredError') {
                return res.status(401).json({ message: 'Token đã hết hạn' });
            } else if (err.name === 'JsonWebTokenError') {
                return res.status(401).json({ message: 'Token không hợp lệ' });
            }
            return res.status(401).json({ message: 'Lỗi xác thực token' });
        }
        req.user = decoded;
        next();
    });
};


//lấy thông tin user khi có token
const getUser = async (req, res) => {
    try {
        const user = await userModel.findById(req.userId, { password: 0 });
        if (!user) {
            throw new Error('Không tìm thấy user');
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

//xác thực admin 
const verifyAdmin = async (req, res, next) => {
    try {
        // Lấy thông tin user từ id lưu trong req khi đã xác thực token
        const user = await userModel.findById(req.userId);
        console.log(user);
        console.log(user.role);
        if (!user) {
            throw new Error('Không tìm thấy user');
        }
        if (user.role !== 'admin') {
            throw new Error('Không có quyền truy cập');
        }
        next();
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = { register, login, getUser, verifyToken, verifyAdmin };