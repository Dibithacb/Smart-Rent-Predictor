import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AIPredictor = () => {

    const navigate=useNavigate()

    useEffect(()=>{
        alert("The AI Predictor feature is paused until backend development is complete. You will be redirected to the Properties page.")
        navigate('/properties')
    },[navigate])
 return null;
};

export default AIPredictor;
