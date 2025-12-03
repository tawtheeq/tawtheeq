
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from 'react';

import { useNavigate } from "react-router-dom";


export default function About() {
    const navigate = useNavigate();
    // const [count, setCount] = useState(0)

    return (
        <div className="h-full bg-gradient-to-br from-gray-100 via-white to-gray-200 flex items-center justify-center">
            <div className="text-center">
                <div className="mb-8">
                    <img src="../assets/mohanadLogo.png" alt="Mohanad logo" className="mx-auto h-64 w-auto" />
                </div>
                <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-gray-100 p-8 max-w-2xl">
                    <h1 className="text-3xl font-bold text-gray-800 mb-4">إدارة العمليات الإعلامية</h1>
                    <p className="text-gray-600 text-lg">منصة لإدارة العمليات الإعلامية وتوثيقها.</p>
                    {/* <img src="../assets/mohanadLogo.png" alt="Mohanad logo" className="mx-auto h-64 w-auto" /> */}


                </div>
            </div>
        </div>

    );
}


