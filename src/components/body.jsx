import React, { useEffect, useState } from 'react';
import WbSunnyIcon from '@material-ui/icons/WbSunny';
import NightsStayIcon from '@material-ui/icons/NightsStay';
import Header from "./header";


function UI() {

    const [data, setData] = useState('');
    const [cityname, setCity] = useState("");
    const [day, setDay] = useState(true);
    const [location, setLocation] = useState(true);
    const [backgroundC, setBackgroundC] = useState("url('https://cdn.dribbble.com/users/27231/screenshots/2432051/welcome.gif')");


    var bg = {
        backgroundImage: backgroundC
    }

    const updateWallpaper = (data, time) => {

        if (data.message !== "city not found") {
            if (data.clouds.all < 60) {
                if ((parseInt(time) >= 18) || (parseInt(time) < 6)) { setBackgroundC("url('https://orig00.deviantart.net/0c30/f/2012/259/f/9/bulalakaw_shooting_star_by_mjesther13-d5euq59.gif')") }
                else if (parseInt(time) >= 6) { setBackgroundC("url('https://media.giphy.com/media/u01ioCe6G8URG/giphy.gif')") }
            }
            else if (data.clouds.all < 80) {
                if ((parseInt(time) >= 18) || (parseInt(time) < 6)) { setBackgroundC("url('https://th.bing.com/th/id/R.969fa08915973214612ea808637115fc?rik=ICGR9XirG0GsaQ&riu=http%3a%2f%2fnews.bbcimg.co.uk%2fmedia%2fimages%2f69866000%2fjpg%2f_69866858_jeremycangialosicloudsnight.jpg&ehk=yMLwNUbB%2fGIFBi4vRFjnrBerIO5rY0x4b%2fOBIItjEhU%3d&risl=&pid=ImgRaw')") }
                else if (parseInt(time) >= 6) { setBackgroundC("url('https://media.giphy.com/media/u01ioCe6G8URG/giphy.gif')") }
            }
            else if (data.clouds.all >= 90) { setBackgroundC("url(https://i.gifer.com/7RtV.gif)") }
        } else {


        }

    }


    useEffect(() => {


        //Permission for geolocation

        function getLocation() {

            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(showPosition, denyPermission);
            } else {
                console.log("this browser is not support geoloaction");
            }
        }

        function denyPermission(error) {
            fetchData();
        }


        //Show position 

        function showPosition(position) {

            let end_point = `https://api.openweathermap.org/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&appid=${process.env.REACT_APP_WEATHER_API_KEY}`

            fetch(end_point).then(response => response.json()).then(data => {
                setData(data);
                getTimeZone(data);
            }).catch(error => {
                console.log(error);
            });
        }


        //getting country details or Time

        const getTimeZone = (data) => {

            if (data.message !== "city not found") {
                const url = `https://api.timezonedb.com/v2.1/get-time-zone?key=${process.env.REACT_APP_TIMEZONE_KEY}&format=json&by=position&lat=${data.coord.lat}&lng=${data.coord.lon}`;
                fetch(url).then((response) => response.json()).then((result) => {
                    const time = result.formatted.substring(11, 13);
                    if (parseInt(time) >= 18) {
                        setDay(false);
                    } else if (parseInt(time) >= 6) {
                        setDay(true);
                    }
                    updateWallpaper(data, time);
                }).catch((error) => {
                    console.log(error);
                })
            } else {
                setBackgroundC("url('https://cdn.dribbble.com/users/63485/screenshots/4101652/001_maze_beautiful_errors_dribbble.gif')");
            }
        }


        //Featch Data From API

        const fetchData = () => {
            if (cityname !== "") {
                let end_point = `https://api.openweathermap.org/data/2.5/weather?q=${cityname}&appid=${process.env.REACT_APP_WEATHER_API_KEY}`;

                try {
                    fetch(end_point).then((response) => {
                        return response.json();
                    }).then((result) => {
                        setData(result);
                        getTimeZone(result);
                    })
                } catch (error) {
                    console.log(error);
                }
            }
        }

        if (location) {
            getLocation();
            setLocation(false);
        } else {
            fetchData();
        }


    }, [cityname])



    return (

        <div style={{ width: "100%", height: "100vh", backgroundColor: "black" }}>
            <Header setCity={setCity} />

            <div className="body">
                <div className="root_body">
                    <div className="parent_body">
                        <div style={bg} className="img_section">
                        </div>
                        <div className="show_details">
                            {(data.message !== "city not found") ? <div style={{ width: "100%", height: "auto", paddingTop: "2vh" }}>
                                {(data) ? (day) ? <WbSunnyIcon style={{ width: "8vh", height: "8vh" }} /> : <NightsStayIcon style={{ width: "8vh", height: "8vh" }} /> : <h3 style={{ marginTop: "30%" }}>Welcome To The Weather App <br></br> Please Search City On The Search Bar</h3>}
                            </div> : null}
                            {
                                !data ?
                                    null
                                    :
                                    <div>
                                        {(data.message !== "city not found") ? <h1>{(data.main.temp - 273.15).toPrecision(2) + "°C"} </h1> : <h1>City Not Found</h1>}
                                        {(!data.message !== "city not found") ? <p>{data.name} </p> : null}
                                        {(data.message !== "city not found") ? <div>
                                            <p>{"Max Temp : " + (data.main.temp_max - 273.15).toPrecision(2) + "°C, Min Temp : " + (data.main.temp_min - 273.15).toPrecision(2) + "°C,"}</p>
                                            <p>{"Wind Speed : " + data.wind.speed + " ms"}</p>
                                            <p>{`Humidity :  ${data.main.humidity}%, Clody : ${data.clouds.all}%`}</p>
                                            <p>{`Latitude : ${data.coord.lat}, Longitude  : ${data.coord.lon}`}</p>
                                            <p>{"Country Code : " + data.sys.country}</p>
                                        </div> : null}

                                    </div>
                            }
                        </div>
                    </div>
                </div>
            </div>
            <p className="id">Design And Devlop By Surya Kant Sharma</p>
        </div>

    )
}

export default UI;