import React, { useMemo, useState } from 'react'
import '../App.css'

const cars = [
    {
        id: 1,
        year: 2023,
        model: 'Toyota Camry',
        price: 28500,
        mileage: '15,000 mi',
        mileageNum: 15000,
        transmission: 'Automatic',
        fuel: 'Gasoline',
        image:
            'https://images.unsplash.com/photo-1608889174677-3f6ce7b5f0ea?auto=format&fit=crop&w=1200&q=80',
    },
    {
        id: 2,
        year: 2024,
        model: 'Toyota RAV4',
        price: 35000,
        mileage: '5,000 mi',
        mileageNum: 5000,
        transmission: 'Automatic',
        fuel: 'Hybrid',
        image:
            'https://images.unsplash.com/photo-1618299095786-0b74b9b3d5b8?auto=format&fit=crop&w=1200&q=80',
    },
    {
        id: 3,
        year: 2023,
        model: 'Toyota Corolla',
        price: 22000,
        mileage: '20,000 mi',
        mileageNum: 20000,
        transmission: 'Automatic',
        fuel: 'Gasoline',
        image:
            'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=1200&q=80',
    },
]

function Icon({ name }) {
    if (name === 'miles') {
        return (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C6.48 2 2 6.48 2 12h2a8 8 0 0116 0h2c0-5.52-4.48-10-10-10z" fill="#9aa3ad" />
                <path d="M7 13h10v2H7z" fill="#9aa3ad" />
            </svg>
        )
    }
    if (name === 'fuel') {
        return (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7 2h6v10H7z" fill="#9aa3ad" />
                <path d="M15 7h4v9a2 2 0 01-2 2h-2V7z" fill="#9aa3ad" />
            </svg>
        )
    }
    return null
}

export default function Browse() {
    // filter state
    const modelOptions = ['Camry', 'RAV4', 'Corolla', 'Highlander', 'Tacoma', 'Prius']
    const [selectedModels, setSelectedModels] = useState([])

    const PRICE_MIN = 15000
    const PRICE_MAX = 60000
    const [priceMax, setPriceMax] = useState(PRICE_MAX)

    const MILEAGE_MIN = 0
    const MILEAGE_MAX = 50000
    const [mileageMax, setMileageMax] = useState(MILEAGE_MAX)

    const toggleModel = (model) => {
        setSelectedModels((prev) => (prev.includes(model) ? prev.filter((m) => m !== model) : [...prev, model]))
    }

    const resetFilters = () => {
        setSelectedModels([])
        setPriceMax(PRICE_MAX)
        setMileageMax(MILEAGE_MAX)
    }

    const filtered = useMemo(() => {
        return cars.filter((c) => {
            // model filter (match any selected model by substring of model name)
            if (selectedModels.length > 0) {
                const matchesModel = selectedModels.some((m) => c.model.toLowerCase().includes(m.toLowerCase()))
                if (!matchesModel) return false
            }
            // price filter
            if (c.price > priceMax) return false
            // mileage filter
            if ((c.mileageNum ?? 0) > mileageMax) return false
            return true
        })
    }, [selectedModels, priceMax, mileageMax])

    return (
        <div className="page">
            <header className="topbar">
                <div className="brand">
                    <div className="brand-logo">T</div>
                    <div className="brand-text">
                        <div className="title">Toyota Inventory</div>
                        <div className="subtitle">Find Your Perfect Vehicle</div>
                    </div>
                </div>
            </header>

            <div className="container">
                <aside className="sidebar">
                    <div className="filters-header">
                        <h3>Filters</h3>
                        <button className="reset" onClick={resetFilters}>Reset</button>
                    </div>

                    <div className="filter-block">
                        <h4>Model</h4>
                        {modelOptions.map((m) => (
                            <label key={m}>
                                <input
                                    type="checkbox"
                                    checked={selectedModels.includes(m)}
                                    onChange={() => toggleModel(m)}
                                />
                                {m}
                            </label>
                        ))}
                    </div>

                    <div className="filter-block">
                        <h4>Price Range</h4>
                        <input
                            type="range"
                            min={PRICE_MIN}
                            max={PRICE_MAX}
                            step={500}
                            value={priceMax}
                            onChange={(e) => setPriceMax(Number(e.target.value))}
                        />
                        <div className="range-labels"><span>${PRICE_MIN.toLocaleString()}</span><span>${priceMax.toLocaleString()}</span></div>
                    </div>

                    <div className="filter-block">
                        <h4>Mileage</h4>
                        <input
                            type="range"
                            min={MILEAGE_MIN}
                            max={MILEAGE_MAX}
                            step={1000}
                            value={mileageMax}
                            onChange={(e) => setMileageMax(Number(e.target.value))}
                        />
                        <div className="range-labels"><span>{MILEAGE_MIN.toLocaleString()} mi</span><span>{mileageMax.toLocaleString()} mi</span></div>
                    </div>
                </aside>

                <main className="content">
                    <div className="cards">
                        {filtered.map((c) => (
                            <article className="card" key={c.id}>
                                <div className="card-media">
                                    <span className="badge">{c.year}</span>
                                    <img src={c.image} alt={c.model} />
                                </div>
                                <div className="card-body">
                                    <h3 className="car-title">{c.model}</h3>
                                    <div className="price">${c.price.toLocaleString()}</div>

                                    <ul className="specs">
                                        <li><Icon name="miles" /> <span>{c.mileage}</span></li>
                                        <li><Icon name="fuel" /> <span>{c.fuel}</span></li>
                                    </ul>

                                    <button className="details">View Details</button>
                                </div>
                            </article>
                        ))}
                    </div>
                </main>
            </div>
        </div>
    )
}