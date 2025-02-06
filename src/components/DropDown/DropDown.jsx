import React, { useState } from 'react';
import './DropDown.css';

const DropDown = ({ optionsValue,optionsTitle, onChange,title,value }) => {
    return (
        <label>
          {title}
          <select value={value} onChange={(e) => onChange(e.target.value)}>
            {optionsValue.map((val,index)=><option key={val} value={val}>{optionsTitle[index]}</option>)}
          </select>
        </label>
    );
};

export default DropDown;