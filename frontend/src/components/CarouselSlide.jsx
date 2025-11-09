import "../css/CarouselSlide.css"
export default function CarouselSlide(props) {

    const style = {
        "backgroundColor": props.color,
    }
    return (
        <div className="carousel-slide" style={ style }>
            <div className="text">
                <span className="status">{ props.status }</span>
                <span className="name">{ props.name }</span>
                <span className="price-info">Starting at <span className="price">${ props.price }</span></span>
                <div className="buttons">
                    <button className="covered">Explore Now</button>
                    <button>Schedule Visit</button>
                </div>
            </div>

            <div className="img">
            </div>
        </div>
    )
}