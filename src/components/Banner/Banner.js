import React from "react";
import Carousel from "./Carousel"; // our new animated text component
import "../../styles/Banner.css";

function Banner() {
  return (
    <div className="banner">
      <div className="overlay"></div> {/* optional: dark overlay */}
      <Carousel /> {/* animated title & subtitle */}
    </div>
  );
}

export default Banner;
