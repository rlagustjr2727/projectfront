import React, { useState } from 'react';
import Input from "../../components/Input";

const WhiskeyAge = ({ handleChange }) => {
    const [selectedAge, setSelectedAge] = useState("");

    const onCategoryChange = (value) => {
        setSelectedAge(value);
        handleChange("wboard_yo", value);
    };

    return (
        <div className="section-container">
            <h3 className="whiskey-age-title">년도</h3>
            {["", "54", "40", "38", "30", "25", "23", "21", "19", "18", "17", "16", "15", "14", "13", "12", "11", "10", "8", "7", "4"].map((yo) => (
                <Input 
                    key={yo} 
                    handleChange={() => onCategoryChange(yo)} 
                    value={yo} 
                    title={yo === "" ? "All" : `${yo}Yo`} 
                    name="wboard_yo" 
                    isSelected={selectedAge === yo} 
                />
            ))}
        </div>
    );
};

export default WhiskeyAge;
