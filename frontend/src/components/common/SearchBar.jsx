import { useState, useCallback } from 'react'

/**
 * SmartSearchBar - Advanced search with filters and smart suggestions
 */
export default function SearchBar({ 
  search, 
  onSearchChange, 
  showFilters,
  availableTags = []
}) {
  const [showFilters, setShowFilters] = useState(false)
  const [suggestions, setSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)

  const handleSearchChange = useCallback((value) => {
    onSearchChange(value)
    
    // Generate smart suggestions based on search
    if (value.length > 1) {
      const lowerValue = value.toLowerCase()
      const tagMatches = availableTags
        .filter(tag => tag.toLowerCase().includes(lowerValue))
        .map(tag => `#${tag}`)
      
      const suggestions = [
        ...tagMatches.slice(0, 3)
      ]
      
      setSuggestions(suggestions)
      setShowSuggestions(true)
    } else {
      setSuggestions([])
      setShowSuggestions(false)
    }
  }, [onSearchChange, availableTags])

  const applySuggestion = (suggestion) => {
    onSearchChange(suggestion)
    setShowSuggestions(false)
  }

  return (
    <div className="space-y-4">
      {/* Search Input */}
      <div className="relative">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Search by name, artist, or tags (e.g., #abstract)..."
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
              onFocus={() => search && setSuggestions && setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              className="w-full px-4 py-2.5 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500 transition-colors"
            />
            
            {/* Search Icon */}
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
              🔍
            </div>

            {/* Smart Suggestions Dropdown */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-slate-800 border border-slate-600 rounded-lg shadow-lg z-10">
                {suggestions.map((suggestion, idx) => (
                  <button
                    key={idx}
                    onClick={() => applySuggestion(suggestion)}
                    className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-slate-700 hover:text-white transition-colors first:rounded-t-lg last:rounded-b-lg"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
     </div>
        );
    };
