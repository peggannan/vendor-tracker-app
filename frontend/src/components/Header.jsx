// src/components/Header.jsx
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getProducts } from "../api/api";
import HamburgerMenu from "./HamburgerMenu";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faMagnifyingGlass, faBell, faXmark } from "@fortawesome/free-solid-svg-icons";
import logos from "../assets/logos.png";

export default function Header({ showSearch = true }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchActive, setSearchActive] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const searchRef = useRef(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!searchQuery.trim()) { setSearchResults([]); return; }
    getProducts().then(({ data }) => {
      const q = searchQuery.toLowerCase();
      setSearchResults(
        data.products.filter((p) =>
          p.name.toLowerCase().includes(q) ||
          p.sku?.toLowerCase().includes(q) ||
          p.category?.toLowerCase().includes(q)
        ).slice(0, 6)
      );
    }).catch(() => setSearchResults([]));
  }, [searchQuery]);

  // const shopName = user?.shopName || "My Shop";
  const brandName = "Shelfline";

  return (
    <>
      <header className="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 px-4 py-3 relative">
        <div className="flex items-center gap-3 max-w-lg mx-auto">

          {/* Left — hamburger + shop info */}
          <button
            onClick={() => setMenuOpen(true)}
            className="p-1 flex-shrink-0"
          >
            <FontAwesomeIcon icon={faBars} className="text-gray-700 dark:text-gray-200 text-lg" />
          </button>

          <div className="flex-shrink-0">
            <div className="flex items-center gap-1 mb-0.5">
              {/* Brand icon */}
              {/* link logo for public */}
             <img src={logos} alt="logo" className="w-6 h-6 object-contain" />
              {/* <div className="w-4 h-4 bg-brand-600 rounded-sm flex items-center justify-center"> */}
                {/* <FontAwesomeIcon icon={faMagnifyingGlass} className="text-white text-xs" /> */}
              
              <span className="text-[10px] font-bold text-gray-700 dark:text-gray-100 tracking-widest uppercase">
                {brandName}
              </span>
            </div>
            {/* <p className="text-sm font-bold text-gray-800 dark:text-gray-100 leading-none">
              {shopName.length > 12 ? shopName.slice(0, 12) + "..." : shopName}
            </p> */}
          </div>

          {/* Center — search bar */}
          {showSearch && (
            <div className={`flex-1 flex items-center border rounded-full px-3 py-2 gap-2 transition-colors ${
              searchActive
                ? "bg-white dark:bg-gray-700 border-brand-500 shadow-sm"
                : "bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
            }`}>
              <svg width="14" height="14" fill="none" stroke="#9ca3af" strokeWidth="2" className="flex-shrink-0">
                <circle cx="6" cy="6" r="5" />
                <path d="M13 13l-3-3" />
              </svg>
              <input
                ref={searchRef}
                type="text"
                placeholder="Search products, stock..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setSearchActive(true)}
                onBlur={() => { if (!searchQuery) setSearchActive(false); }}
                className="bg-transparent text-xs text-gray-600 dark:text-gray-300 placeholder-gray-400 focus:outline-none w-full"
              />
              {searchQuery && (
                <button onClick={() => { setSearchQuery(""); setSearchActive(false); }}>
                  <FontAwesomeIcon icon={faXmark} className="text-gray-400 text-xs" />
                </button>
              )}
            </div>
          )}

          {/* Search results dropdown */}
          {searchActive && searchQuery && (
            <div className="absolute top-full left-0 right-0 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl shadow-xl mt-1 mx-4 z-[100] overflow-hidden max-h-64 overflow-y-auto">
              {searchResults.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-4">No results for "{searchQuery}"</p>
              ) : (
                searchResults.map((p) => (
                  <button
                    key={p.id}
                    onMouseDown={() => { navigate(`/products/${p.id}`); setSearchQuery(""); setSearchActive(false); }}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 text-left border-b border-gray-50 dark:border-gray-700 last:border-0"
                  >
                    <div className="w-8 h-8 bg-brand-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg width="14" height="14" fill="none" stroke="#6c47ff" strokeWidth="1.5">
                        <path d="M7 1L1 4l6 3 6-3-6-3zM1 10l6 3 6-3M1 7l6 3 6-3" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">{p.name}</p>
                      <p className="text-xs text-gray-400">₵{p.price} · {p.stock} in stock</p>
                    </div>
                  </button>
                ))
              )}
            </div>
          )}
          {/* Right — notification bell */}
          <button
            onClick={() => navigate("/notifications")}
            className="relative flex-shrink-0 w-9 h-9 rounded-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center justify-center"
          >
            <FontAwesomeIcon icon={faBell} className="text-gray-600 dark:text-gray-300 text-sm" />
            {/* Badge */}
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-brand-600 rounded-full flex items-center justify-center text-[9px] text-white font-bold">
              2
            </span>
          </button>

        </div>
      </header>

      <HamburgerMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}