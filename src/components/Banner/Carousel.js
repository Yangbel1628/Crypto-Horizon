import { useEffect, useState } from "react";
import "../../styles/Carousel.css"; // same file for animations

const Carousel = () => {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    // Trigger animation after mount
    const timer = setTimeout(() => {
      setAnimate(true);
    }, 200); // small delay for smooth effect
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="banner-animation-wrapper">
      <h2 className={`banner-title ${animate ? "fade-in-up" : ""}`}>
        Crypto Horizon
      </h2>
      <p className={`banner-subtitle ${animate ? "fade-in-up-delay" : ""}`}>
        Track live cryptocurrency prices and trends in real time
      </p>
    </div>
  );
};

export default Carousel;
