import React from 'react';
import { useAuthStore } from '../../store/auth';
import { Link } from 'react-router-dom';

export function Dashboard(){
    // const isLoggedIn = useAuthStore((state)=>{
    //     state.isLoggedIn,
    //     state.user 
    // })
    const isLoggedIn = useAuthStore((state)=>state.isLoggedIn)
    return(
        <>
        { isLoggedIn()
         ? <div>
            <h1>Dashboard</h1>
            <Link to={'/logout'}>Logout</Link>
         </div>
         : <div>
            <h1>Home Page</h1>
            <Link to={'/register'}>Register</Link>
            <br/>
            <Link to={'/login'}>Login</Link>
         </div>
        }
        </>
    )
}

export default Dashboard;