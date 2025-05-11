import "./BottomMenu.css";

import { useState } from "react";

import { useRouteNavigator } from "@vkontakte/vk-mini-apps-router";

const BottomMenu = ({ page , onResult}) => {
  const navigator = useRouteNavigator();

  const [weAt, setWeAt] = useState(page);
  return (
    <>

      <div style={{
        height:'117px',
        width:'100%',
        background:'white',
        display:'flex',
        justifyContent:'center',
        position:'fixed',
        bottom:'0',
        zIndex: 4

      }}>
        <div style={{
          width:'299px',
          height:'62px',
          display:'flex',
          marginTop:'6px'

        }}>
          <button style={{
            border:'none',
            background:'white',
            padding:0
            }} onClick={() => {
              setWeAt("homepage");
              navigator.replace("/");
              onResult("homepage");
            }}>
            <img src="art_day.svg"></img>
          </button>


          
          <button style={{
            background:'white',
            border:'none',
            margin:'0 58px',
            padding:0
            }} onClick={() => {
              setWeAt("homepage");
              navigator.replace("/");
              onResult("homepage");
            }}>
            <img src="home_page.svg"></img>
          </button>


          <button style={{
            background:'white',
            border:'none',
            padding:0
            }} onClick={() => {
              setWeAt("profilepage");
              navigator.replace("/profilepage");
              onResult("profilepage");
            }}>
            <img src="profile_page.svg"></img>
          </button>

        </div>
      </div>
    </>
  );
};

export default BottomMenu;