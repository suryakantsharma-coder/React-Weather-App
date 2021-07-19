import React, { useState } from 'react';
import cityList from "./cities.json";

function UI({ setCity }) {

    const [data, setdata] = useState('');
    const [showList, setshowList] = useState(false);



    // create functions for data;
    const getData = (event) => {
        setdata(event.target.value);

        if (event.target.value === "") {
            const bool = true;
            setshowList(bool);
        }
    }


    return (
        <div className="header_background">
            <div className="inner_input">
                <div className="input_field">
                    <input className="input_area" placeholder="Enter City name here" onChange={getData} value={data} onKeyDown={(e) => {
                        if (e.keyCode === 13) {
                            setCity(data);
                            setshowList(false);
                        }
                    }}></input>
                    {(showList) ? <ul className="ul_background">

                        {
                            cityList.filter((value, key) => {
                                let match = false;
                                if (data === "") {
                                    return value;
                                } else if (value.toLowerCase().includes(data.toLowerCase())) {
                                    match = true;
                                    return value;
                                }
                                return match;
                            }).map((value, key) => {
                                return (<li key={key} onClick={() => {
                                    setdata(value);
                                    setCity(value);
                                    setshowList(false);
                                }} > {value}</li>)
                            })
                        }

                    </ul> : null}
                </div>
            </div>
        </div>
    )
}

export default UI;