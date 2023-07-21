import { FiltersStyles, CommonPill } from "./FiltersStyles"
import { useState } from "react"

export const Filters = () => {    
    const [activeFilter, setActiveFilter] = useState("All")

    const filters = ['All', 'Guest', 'Circle', 'Artist']
    return (
        <FiltersStyles>
        <div className="filter-section">
          <div className="abs">
            <div className="content">
              <span className="title">Filter by:</span>
              <ul className="filters">
                {filters.map((filter:any)=>{
                    return (<li key={`filter-artist-${filter}`}>
                    <CommonPill
                      className={`clickable small ${
                        filter == activeFilter ? "active" : ""
                      }`}
                      onClick={() => setActiveFilter(filter)}
                    >
                      {filter}
                    </CommonPill>
                  </li>)
                })}
                      
              </ul>
            </div>
          </div>
        </div>
        </FiltersStyles>
    )}