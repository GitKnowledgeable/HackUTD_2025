import '../css/SearchBar.css'
import { IoSearch } from "react-icons/io5";

export default function SearchBar() {
    return (
        <div className="search-bar">
            <form action="" onSubmit={(e) => e.preventDefault()}>
                <label htmlFor="prompt">Prompt</label>
                <input type="text" name='prompt' id="prompt" />
                <button type="submit"><IoSearch /></button>
            </form>
        </div>
    )
}