import "../css/CarouselSlide.css"
export default function CarouselSlide() {
    return (
        <div className="carousel-slide">
            <div className="text">
                <span className="status">New Arrival</span>
                <span className="name">Tacoma TRD Pro</span>
                <span className="price-info">Starting at <span className="price">$39,999</span></span>
                <div className="buttons">
                    <button>Explore Now</button>
                    <button>Schedule Visit</button>
                </div>
            </div>

            <div className="img">
            </div>
        </div>
    )
}