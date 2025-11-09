import CarouselSlide from "./CarouselSlide"
import "../css/Carousel.css"
import { useEffect, useState } from "react";

export default function Carousel() {
    let [carouselIdx, setCarouselIdx] = useState(0);
    let carouselSlideTiming = 5000;

    let slideCount = 3;

    // useEffect(() => {
    //     const moveCarouselInterval = setInterval(() => {
    //         setCarouselIdx((prev) => {
    //             return (prev + 1) % (slideCount)
    //         });
    //     }, carouselSlideTiming)

    //     return () => {
    //         clearInterval(moveCarouselInterval);
    //     }
    // }, [])

    const carouselStyle = {
        "left": "-" + carouselIdx*100 + "dvw"
    }
    const slideIdsStyle = {
        "grid-template-columns": "repeat(" + slideCount + ", 1fr)",
    }

    const slideIds = [];
    for (let i = 0; i < slideCount; i++) {
        slideIds.push(
            <button 
            className={carouselIdx == i ? "slide-id active" : "slide-id"} 
            data-slide-id={i.toString()} onClick={() => setCarouselIdx(i)}>
            </button>
        )
    }

    function increaseCarouselIdx(inc) {
        setCarouselIdx(prev => {
            if ((prev + inc) < 0) {
                return slideCount - 1;
            }
            return (prev + inc) % (slideCount);
        })
    }

    return (
        <div className="carousel-container">
            <button id="left-btn" onClick={() => increaseCarouselIdx(-1)}>&lt;</button>
            <div className="carousel" style={ carouselStyle }>
                <CarouselSlide color="black" status="New Arrival" name="Tacoma TRD Pro" price="39,999" />
                <CarouselSlide color="blue" status="New Arrival" name="Tacoma TRD Pro" price="39,999" />
                <CarouselSlide color="red" status="New Arrival" name="Tacoma TRD Pro" price="39,999" />
            </div>
            <div className="slide-ids" style={ slideIdsStyle }>
                {slideIds}
            </div>
            <button id="right-btn" onClick={() => increaseCarouselIdx(1)}>&gt;</button>
        </div>
    )
}