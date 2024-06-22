const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./database');

exports.registerUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();
    res.status(201).json({ message: 'User registered successfully', id: newUser._id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
      throw new Error('User not found');
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error('Invalid credentials');
    }
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
    res.json({ token });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};

exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.query.userId);
    if (!user) {
      throw new Error('User not found');
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const userId = req.query.userId;
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    const user = await User.findByIdAndUpdate(userId, { username, password }, { new: true });
    if (!user) {
      throw new Error('User not found');
    }
    res.status(200).json({ message: 'User updated successfully', id: user._id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteUser = async (req, res) => {
    try{
        const userId = req.query.userId;
        if(!userId){
            throw new Error('Invalid UserId');
        }

        await User.findByIdAndUpdate(userId);
        res.status(200).json({'Deleted User': userId});
    }
    catch(error){
        res.status(500).json({error: error.message});
    }
}
