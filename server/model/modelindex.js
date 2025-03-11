import { Sequelize ,DataTypes,Model} from "sequelize";
// import User from "./user";
const sequelize1 = new Sequelize('sqlite::memory:');
import initUser from "./user.js";
import initPost from "./post.js";
import initPermission from "./permission.js";
import initRole from "./role.js";


export const sequelize = new Sequelize('ecommerce', 'root', '', {
    host: 'localhost',
    dialect:'mysql', /* one of 'mysql' | 'postgres' | 'sqlite' | 'mariadb' | 'mssql' | 'db2' | 'snowflake' | 'oracle' */
    logging: false
  });
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
  let db={}
  db.Sequelize = Sequelize;
  db.sequelize=sequelize;
  // db.User = User(sequelize, Sequelize)
  // console.log(db.User); // trueconst Role = initRole(sequelize);
const User = initUser(sequelize);
const Permission = initPermission(sequelize);
let Post = initPost(sequelize);
const Role = initRole(sequelize);

  User.hasMany(Post, { foreignKey: "authorId", as: "posts" });
  Post.belongsTo(User, { foreignKey: "authorId", as: "author" });
  
// Association between User and Role (one-to-many)
// Each User belongs to one Role
User.belongsTo(Role, { foreignKey: "roleId", as: "role" });
// A Role can have many Users
Role.hasMany(User, { foreignKey: "roleId", as: "users" });

// Many-to-many association between Role and Permission via a join table "RolePermissions"
Role.belongsToMany(Permission, { 
  through: "RolePermissions", 
  foreignKey: "roleId", 
  otherKey: "permissionId",
  as: "permissions"
});
Permission.belongsToMany(Role, { 
  through: "RolePermissions", 
  foreignKey: "permissionId", 
  otherKey: "roleId",
  as: "roles"
});

sequelize.sync({ force: false  });
 db = { sequelize, User ,Post,Role,Permission};

  // module.exports = sequelize;
  export default db;

