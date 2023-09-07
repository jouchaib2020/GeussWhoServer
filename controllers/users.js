import  User  from "../models/User.js";


export const getUsers = async (req, res) => {
    if (!req.user || req.user.role !== 'admin') {
        return res.status(401).json({ success: false, error: 'Unauthorized' });
    }
    
    try {
        const users = await User.findAll();
        res.status(200).json({
            data: users
        });
    } catch (error) {
        res.status(500).json(error.message);
    }
};


export const getUser = async (req, res) => { 
    if (!req.user) {
        return res.status(401).json({ success: false, error: 'Unauthorized' });
    }
    try {
        const username = req.params.username;
        const existingUser = await User.findOne({where:{username} });
        if (!existingUser)
            return res.status(400).json({ error: "User not found" });

        if (req.user.username !== existingUser.user.username && req.user.role !== 'admin') {
            return res.status(401).json({ success: false, error: 'Unauthorized' });
        }
        return res.status(200).json({
            data: existingUser
        });
    } catch (error) {
        res.status(500).json(error.message);
    }
};


export const deleteUser = async (req, res) => {
    if (!req.user || req.user.role !== 'admin') {
        return res.status(401).json({ success: false, error: 'Unauthorized' });
    }

    const {email} = req.body;
    try {
        const userToDelete = await User.findOne({where: {email} });
        if (!userToDelete) {
            return res.status(400).json({
                error: "The provided email is not associated to any account",
            });
        }

        await User.destroy({where:{email}});
        return res.status(200).json("User deleted successfully");
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
