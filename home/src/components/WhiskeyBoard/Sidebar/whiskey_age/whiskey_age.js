import React, { useState } from 'react';
import Input from "../../components/Input";

const WhiskeyAge = ({ handleChange }) => {
    const [selectedAge, setSelectedAge] = useState("");

    const onCategoryChange = (value) => {
        if (value === "All") {
            // If "All" is selected, reset the selection
            setSelectedAge("");
            handleChange("wboard_yo", "");
        } else {
            setSelectedAge(value);
            handleChange("wboard_yo", value);
        }
    };

    return (
        <div className="section-container">
            <h3 className="whiskey-age-title">YO</h3>
            {["All", "21~", "21", "19", "18", "17", "16", "15", "14", "13", "12", "~12", "N/A"].map((yo) => (
                <Input 
                    key={yo} 
                    handleChange={() => onCategoryChange(yo)} 
                    value={yo} 
                    title={yo === "21~" || yo === "N/A" || yo === "All" ? yo : `${yo}Yo`} 
                    name="wboard_yo" 
                    isSelected={selectedAge === yo} 
                />
            ))}
        </div>
    );
};

export default WhiskeyAge;
