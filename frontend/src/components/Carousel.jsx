import CarouselSlide from "./CarouselSlide"
import "../css/Carousel.css"
import { useEffect, useState } from "react";

export default function Carousel() {
    let [carouselIdx, setCarouselIdx] = useState(0);
    let carouselSlideTiming = 10000;
    let slideTimingBuffer = 7000;
    let lastSlide = Date.now()

    let slideCount = 3;

    useEffect(() => {
        const moveCarouselInterval = setInterval(() => {
            // Date.now() = number of milliseconds since Jan 1, 1970
            if ((Date.now() - lastSlide) >= slideTimingBuffer) {
                increaseCarouselIdx(1);
                lastSlide = Date.now();
            }
        }, carouselSlideTiming);

        return () => {
            clearInterval(moveCarouselInterval);
        }
    }, [])

    const carouselStyle = {
        "left": "-" + carouselIdx*100 + "dvw"
    }
    const slideIdsStyle = {
        "gridTemplateColumns": "repeat(" + slideCount + ", 1fr)",
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
            <button id="left-btn" onClick={() => { increaseCarouselIdx(1); lastSlide = Date.now(); }}>&lt;</button>
            <div className="carousel" style={ carouselStyle }>
                <CarouselSlide color="black" status="New Arrival" name="Tacoma TRD Pro" price="39,999" />
                <CarouselSlide color="blue" status="New Arrival" name="Tacoma TRD Pro" price="39,999" />
                <CarouselSlide color="red" status="New Arrival" name="Tacoma TRD Pro" price="39,999" />
            </div>
            <div className="slide-ids" style={ slideIdsStyle }>
                {slideIds}
            </div>
            <button id="right-btn" onClick={() => { increaseCarouselIdx(1); lastSlide = Date.now(); }}>&gt;</button>
        </div>
    )
}