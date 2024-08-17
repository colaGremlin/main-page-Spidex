'use client'

import React, { useState, useEffect } from 'react';
import '@fortawesome/fontawesome-svg-core/styles.css';
import { config, library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter } from '@fortawesome/free-solid-svg-icons';

config.autoAddCss = false;

const Home: React.FC = () => {
  const [url, setUrl] = useState<string>('');
  const [result, setResult] = useState<any[]>([]);
  const [filter, setFilter] = useState<string>('all');
  const [isDropdownOpen, setDropdownOpen] = useState<boolean>(false);

  const mockData = [
    { type: 'link', content: 'http://example.com' },
    { type: 'text', content: 'This is example text' },
    { type: 'heading', content: 'Example Heading 1' },
    { type: 'link', content: 'http://anotherexample.com' },
    { type: 'text', content: 'Another piece of text' },
    { type: 'heading', content: 'Example Heading 2' },
  ];

  useEffect(() => {
    setResult(mockData);
  }, []);

  const handleScrape = async () => {
    if (url) {
      try {
        const response = await fetch('/api/scrape', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ url }),
        });

        const data = await response.json();

        if (data.success) {
          setResult(data.data);

          const jsonBlob = new Blob([JSON.stringify(data.data)], { type: 'application/json' });
          const jsonUrl = URL.createObjectURL(jsonBlob);
          const link = document.createElement('a');
          link.href = jsonUrl;
          link.download = 'scraped_data.json';
          link.click();
          URL.revokeObjectURL(jsonUrl);
        } else {
          setResult([]);
        }
      } catch (error) {
        console.error(error instanceof Error ? error.message : 'An unexpected error occurred');
        setResult([]);
      }
    } else {
      setResult([]);
    }
  };

  const filteredResult = filter === 'all' ? result : result.filter(item => item.type === filter);

  return (
    <>
      <nav className="bg-white shadow-md py-4">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-semibold">Spidex</h1>
        </div>
      </nav>
      <div className="container mx-auto mt-10 p-5 bg-white rounded shadow max-w-4xl">
        <h2 className="text-3xl font-normal text-center mb-6">Web Scraper</h2>
        <div className="flex flex-col items-center mb-6 w-full max-w-lg mx-auto">
          <div className="flex items-center space-x-2 w-full">
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Enter URL"
              className="border border-gray-300 p-2 rounded flex-grow"
            />
            <button onClick={handleScrape} className="bg-blue-900 text-white p-2 rounded shadow">
              Download as JSON
            </button>
          </div>
          <div className="relative mt-2 w-full flex justify-end">
            <button
              className="bg-gray-200 border border-gray-300 text-gray-700 p-2 rounded shadow mt-2"
              id="options-menu"
              aria-haspopup="true"
              aria-expanded={isDropdownOpen}
              onClick={() => setDropdownOpen(!isDropdownOpen)}
            >
              <FontAwesomeIcon icon={faFilter} className="mr-2" />
              Filter
            </button>
            {isDropdownOpen && (
              <div 
                className="absolute top-full mt-1 right-0 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50"
                role="menu" 
                aria-orientation="vertical" 
                aria-labelledby="options-menu">
                <div className="py-1" role="none">
                  <button
                    onClick={() => { setFilter('all'); setDropdownOpen(false); }}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                    role="menuitem"
                  >
                    All
                  </button>
                  <button
                    onClick={() => { setFilter('link'); setDropdownOpen(false); }}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                    role="menuitem"
                  >
                    Links
                  </button>
                  <button
                    onClick={() => { setFilter('text'); setDropdownOpen(false); }}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                    role="menuitem"
                  >
                    Text
                  </button>
                  <button
                    onClick={() => { setFilter('heading'); setDropdownOpen(false); }}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                    role="menuitem"
                  >
                    Headings
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
        {filteredResult.length > 0 && (
          <div className="overflow-x-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
              {filteredResult.map((item, index) => (
                <div key={index} className="p-3 border border-gray-300 rounded bg-gray-50 overflow-hidden">
                  <p className="truncate">{item.content}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <footer className="bg-blue-900 text-white text-center py-1 mt-10">
        <div className="container mx-auto px-4">
          <p>Copyright © 2024 by Spidex. All rights reserved.</p>
        </div>
      </footer>
    </>
  );
};

export default Home;