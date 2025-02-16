import axios from "axios";
import {React, useEffect} from "react";
import { getProfile } from "../redux/actions/userAction";
import { useDispatch,useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";

function Home(){
  const { user, loading, error } = useSelector((state) => state.user);
  const dispatch = useDispatch()
  const navigate = useNavigate()
    useEffect(() => {
        const fetchData = async () => {
          try {
         dispatch(getProfile())
           
          } catch (error) {
            console.error("Error fetching data:", error);
          }
        };
    console.log('hellouser',user)
        fetchData(); // Execute the function inside useEffect
      }, [user]); // Dependency array
    
    return(
        <Sidebar/>
      
    )
}

export default Home;