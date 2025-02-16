import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/actions/userAction";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Menu, Button } from "antd";
import { Link } from "react-router-dom";

const Header = ({ title }) => {
  const { singleUser, loading, error } = useSelector((state) => state.user);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
    console.log("User logged out!");
  };

  useEffect(() => {
  }, [dispatch, singleUser]);
  if (!singleUser) {
    return navigate("/login")
}
  const menuItems = [{ key: "home", label: <Link to="/">Home</Link> }];
  if (
    singleUser &&
    singleUser.roles?.some(
      (role) =>  role.roleName === "Admin"
    )
  ) {
    menuItems.push({
      key: "create-post",
      label: <Link to="/create-post">Create Post</Link>,
	  
    });
	menuItems.push({
		key: "admin",
		label: <Link to="/admin/blogcontrol">Admin</Link>,
		
	  });
  }
  if (
    singleUser &&
    singleUser.roles?.some(
      (role) => role.roleName === "Editor" 
    )
  ) {
    menuItems.push({
      key: "create-post",
      label: <Link to="/create-post">Create Post</Link>,
	  
    });
	
  }

  return (
    <header className="bg-gray-900 bg-opacity-50 backdrop-blur-md shadow-lg border-b border-gray-900">
      <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Title on the Left */}
        <h1 className="text-2xl font-semibold text-gray-100">{title}</h1>

        {/* Logout Button on the Right */}

        <div className="">
          <div className="container mx-auto flex justify-between items-center">
            {/* Left-aligned menu */}
            <nav className="flex space-x-8 text-lg font-medium text-white">
              {menuItems.map((item) => (
                <Link
                  key={item.key}
                  to={item.label.props.to}
                  className="hover:text-gray-400 transition"
                >
                  {item.label.props.children}
                </Link>
              ))}
            </nav>

            {/* Right-aligned login/logout button with spacing */}
            <div className="ml-10">
			{singleUser && Object.keys(singleUser).length > 0 ?  (
  <button
    onClick={handleLogout}
    className="bg-gray-800 bg-opacity-50 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-all duration-300 ease-in-out"
  >
    Logout
  </button>
) : (
  <Link to="/login">
    <button className="bg-gray-800 bg-opacity-50 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-all duration-300 ease-in-out">
      Login
    </button>
  </Link>
)}


            </div>
          </div>
        </div>
      </div>
    </header>
  
  );
};
export default Header;
