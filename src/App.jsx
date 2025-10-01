import { useState } from "react";
import SearchBar from "./components/SearchBar";
import DeveloperCard from "./components/DeveloperCard";
import ComparisonTable from "./components/ComparisonTable";
import ReviewsList from "./components/ReviewsList";
import ReportDownloader from "./components/ReportDownloader";
import TrustMeter from "./components/TrustMeter";
import { developersData, categoryDisplayNames } from "./data";

export default function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDeveloper, setSelectedDeveloper] = useState(null);
  const [selectedDevelopers, setSelectedDevelopers] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [visibleCategories, setVisibleCategories] = useState(Object.keys(categoryDisplayNames));

  // simple search function (replace with fuzzySearch util if desired)
  const handleSearch = () => {
    const dev = Object.values(developersData).find(d =>
      d.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    if (dev) {
      setSelectedDeveloper(dev);
      setSelectedDevelopers([dev]);
    } else {
      alert("No developer found");
    }
  };

  const handleCompare = (developer) => {
    setSelectedDevelopers(prev => {
      if (prev.find(d => d.name === developer.name)) return prev;
      return [...prev, developer];
    });
  };

  const toggleCategory = (category) => {
    setVisibleCategories(prev =>
      prev.includes(category) ? prev.filter(c => c !== category) : [...prev, category]
    );
  };

  return (
    <div className="container mx-auto p-4">
      {/* 🔍 Search */}
      <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} onSearch={handleSearch} />

      {/* 🏢 Developer Results */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {Object.values(developersData).map((dev) => (
          <DeveloperCard
            key={dev.name}
            developer={dev}
            onSelect={setSelectedDeveloper}
            onCompare={handleCompare}
          />
        ))}
      </div>

      {/* 📊 Comparison */}
      {selectedDevelopers.length > 1 && (
        <ComparisonTable
          selectedDevelopers={selectedDevelopers}
          visibleCategories={visibleCategories}
          toggleCategory={toggleCategory}
          categoryDisplayNames={categoryDisplayNames}
        />
      )}

      {/* 📝 Developer Details */}
      {selectedDeveloper && (
        <div id="developer-report" className="mt-8">
          <h2 className="text-2xl font-bold mb-2">{selectedDeveloper.name}</h2>
          <p className="text-muted-foreground mb-4">{selectedDeveloper.overview}</p>
          <TrustMeter score={selectedDeveloper.trustScore} />
          <div className="mt-4">
            <ReviewsList
              reviews={selectedDeveloper.reviews}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              categories={["all", ...Object.keys(categoryDisplayNames)]}
            />
          </div>
          <ReportDownloader selectedDeveloper={selectedDeveloper} />
        </div>
      )}
    </div>
  );
}