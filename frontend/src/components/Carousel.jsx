import CarouselSlide from "./CarouselSlide"

export default function Carousel() {
    return (
        <div className="carousel">
            <CarouselSlide status="New Arrival" name="Tacoma TRD Pro" price="39,999" />
            <CarouselSlide status="New Arrival" name="Tacoma TRD Pro" price="39,999" />
            <CarouselSlide status="New Arrival" name="Tacoma TRD Pro" price="39,999" />
        </div>
    )
}