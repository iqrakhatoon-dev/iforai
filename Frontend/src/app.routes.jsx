import {createBrowserRouter} from "react-router";
import Login from "./features/auth/pages/Login.jsx";
import Register from "./features/auth/pages/Register.jsx";
import Home from "./features/auth/pages/Home.jsx";
import Protection from "./features/auth/components/protection.jsx";
import Dashboard from "./features/interview/pages/Dashboard.jsx";
import InterviewReport from "./features/interview/pages/InterviewReport.jsx";

export const router = createBrowserRouter([
    {
        path: "/", 
        element: <Home/>
    },
    {
        path: '/login',
        element: <Login/>
    },
    {
        path: '/register',
        element: <Register/>
    },{
        path: '/dashboard',
        element: <Protection><Dashboard/></Protection>
    },{
        path: '/dashboard/report/:id',
        element: <Protection><InterviewReport/></Protection>
    }
])