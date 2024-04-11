const HttpError = require("../models/errorModel");
const userModel = require("../models/users-model");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const { v4: uuid } = require('uuid');


const registerUser = async (req, res, next) => {
    try {
        const { name, email, password, password2 } = req.body;
        if (!name || !email || !password || !password2) {
            return next(new HttpError("Fill in all fields.", 422));
        }

        const newEmail = email.toLowerCase();

        const emailExists = await userModel.findOne({ email: newEmail });

        if (emailExists) {
            return next(new HttpError("Email already exists", 422));
        }

        if ((password.trim()).length < 6) {
            return next(new HttpError("Password length must be at least 6 characters", 422));
        }

        if (password !== password2) {
            return next(new HttpError("Passwords do not match", 422));
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await userModel.create({ name, email: newEmail, password: hashedPassword });
        return res.status(201).json({ message: "User created successfully", newUser });
    } catch (error) {
        return next(new HttpError("User registration failed", 422));
    }
};

const loginUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return next(new HttpError("Fill in all fields", 422));
        }

        const enteredEmail = email.toLowerCase();

        const user = await userModel.findOne({ email: enteredEmail });

        if (!user) {
            return next(new HttpError("Invalid credentials", 422));
        }

        const comparePass = await bcrypt.compare(password, user.password);

        if (!comparePass) {
            return next(new HttpError("Invalid credentials", 422));
        }

        const { _id: id, name } = user;
        const token = jwt.sign({ id, name }, "your_secret_key_here", { expiresIn: "1d" });

        res.status(200).json({ message: "Logged In successfully", token, id, name });
    } catch (error) {
        return next(new HttpError("User login failed", 422));
    }
};

const getUser = async (req, res, next) => {
    const { id } = req.params;
    const user = await userModel.findById(id).select("-password");
    if (!user) {
        return next(new HttpError("User not found", 404));
    }
    res.status(200).json(user);
};

const changeAvatar = async (req, res, next) => {
    try {
        if (!req.files.avatar) {
            return next(new HttpError("Please choose an image", 422));
        }

        const user = await userModel.findById(req.user.id);

        if (user.avatar) {
            fs.unlinkSync(path.join(__dirname, '..', 'uploads', user.avatar));
        }

        if (req.files.avatar.size > 500000) {
            return next(new HttpError("Image size too big. should be less than 500kb", 422));
        }

        const extension = req.files.avatar.name.split('.').pop();
        const newFileName = uuid() + '.' + extension;

        req.files.avatar.mv(path.join(__dirname, '..', 'uploads', newFileName), async (err) => {
            if (err) {
                return next(new HttpError(err));
            }
            const updatedAvatar = await userModel.findByIdAndUpdate(req.user.id, { avatar: newFileName }, { new: true });

            if (!updatedAvatar) {
                return next(new HttpError("Avatar couldn't be changed", 422));
            }
            res.status(200).json(updatedAvatar);
        });
    } catch (error) {
        return next(new HttpError(error.message, 500));
    }
};

const editUser = async (req, res, next) => {
    try {
        const { name, email, currentPassword, newPassword, confirmNewPassword } = req.body;
        if (!name || !email || !currentPassword || !newPassword || !confirmNewPassword) {
            return next(new HttpError("Fill in all fields", 422));
        }

        const user = await userModel.findById(req.user.id);
        if (!user) {
            return next(new HttpError("User not found", 403));
        }

        const emailExist = await userModel.findOne({ email });

        if (emailExist && (emailExist._id != req.user.id)) {
            return next(new HttpError("Email already exists", 422));
        }

        const validateUserPassword = await bcrypt.compare(currentPassword, user.password);

        if (!validateUserPassword) {
            return next(new HttpError("Invalid current password", 422));
        }

        if (newPassword !== confirmNewPassword) {
            return next(new HttpError("New Passwords don't match", 422));
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        const newInfo = await userModel.findByIdAndUpdate(req.user.id, { name, email, password: hashedPassword }, { new: true });

        return res.status(200).json({ message: "User updated successfully", newInfo });
    } catch (error) {
        return next(new HttpError(error.message, 500));
    }
};

module.exports = { registerUser, loginUser, getUser, changeAvatar, editUser };
