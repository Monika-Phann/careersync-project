const { Sequelize, DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const seed = async () => {
    const sequelize = new Sequelize(
        process.env.DB_NAME, 
        process.env.DB_USER, 
        process.env.DB_PASSWORD, 
        { host: process.env.DB_HOST, dialect: 'postgres', logging: false }
    );

    try {
        await sequelize.authenticate();
        console.log(`✅ Connected to ${process.env.DB_NAME}`);

        // Define Models explicitly for Seeding
        const User = sequelize.define('User', {
            id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
            email: { type: DataTypes.STRING, allowNull: false, unique: true },
            password: { type: DataTypes.STRING, allowNull: false },
            role_name: { type: DataTypes.STRING, allowNull: false },
            status: { type: DataTypes.STRING, defaultValue: 'active' }
        }, { tableName: 'user', timestamps: true, underscored: true });

        const AccUser = sequelize.define('AccUser', {
            id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
            user_id: { type: DataTypes.UUID, allowNull: false },
            first_name: DataTypes.STRING,
            last_name: DataTypes.STRING
        }, { tableName: 'acc_user', timestamps: true, underscored: true });

        // CREATE TABLES (Alter ensures they exist)
        console.log('🔄 Syncing tables...');
        await sequelize.sync({ alter: true });

        // CREATE ADMIN
        const hashedPassword = await bcrypt.hash('password123', 10);
        const [user, created] = await User.findOrCreate({
            where: { email: 'admin@example.com' },
            defaults: {
                email: 'admin@example.com',
                password: hashedPassword,
                role_name: 'admin',
                status: 'active'
            }
        });

        if (created) console.log('✅ Admin User Created.');
        else console.log('ℹ️ Admin User already exists.');

        const existingProfile = await AccUser.findOne({ where: { user_id: user.id } });
        if (!existingProfile) {
            await AccUser.create({ user_id: user.id, first_name: 'Edu', last_name: 'Admin' });
            console.log('🚀 Admin Profile Created.');
        }

    } catch (error) {
        console.error('❌ SEED ERROR:', error);
    } finally {
        await sequelize.close();
    }
};

seed();