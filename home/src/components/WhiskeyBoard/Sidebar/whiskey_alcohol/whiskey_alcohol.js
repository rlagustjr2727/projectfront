import React, { useState } from 'react';
import Input from '../../components/Input';

const WhiskeyAlcohol = ({ handleChange }) => {
  const [selectedAbvType, setSelectedAbvType] = useState('');

  const onCategoryChange = (value) => {
    setSelectedAbvType(value);
    handleChange('wboard_abv_type', value);
  };

  return (
    <div className="section-container">
      <h3 className="whiskey-alcohol-title">도수</h3>
      {["", "E", "D", "C", "B", "A"].map((type, index) => (
        <Input 
          key={type} 
          handleChange={() => onCategoryChange(type)} 
          value={type} 
          title={
            type === "" ? "All" : 
            type === "E" ? "60% 이상" : 
            type === "D" ? "50% ~ 60%" : 
            type === "C" ? "40% ~ 50%" : 
            type === "B" ? "30% ~ 40%" : 
            "30% 미만"
          } 
          name="wboard_abv_type" 
          isSelected={selectedAbvType === type} 
        />
      ))}
    </div>
  );
};

export default WhiskeyAlcohol;
