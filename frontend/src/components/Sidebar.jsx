import React, { useState } from 'react';
import axios from 'axios';
import { Upload, Search, Filter, Database, FileJson, Image as ImageIcon, Map as MapIcon } from 'lucide-react';

const Sidebar = ({ filters, setFilters, refreshData }) => {
  const [uploadState, setUploadState] = useState('');
  const [file, setFile] = useState(null);
  
  // New state variables for image context
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  
  const handleFileUpload = async (e) => {
    e.preventDefault();
    if (!file && !title && !description) return;
    
    setUploadState('uploading...');
    const formData = new FormData();
    if (file) formData.append('file', file);
    
    // Append context so our AI NLP has text to analyze!
    formData.append('title', title);
    formData.append('description', description);
    
    try {
      await axios.post('https://intelfusion-backend.onrender.com/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setUploadState('Success!');
      setFile(null);
      setTitle('');
      setDescription('');
      document.getElementById('fileInput').value = '';
      refreshData();
      
      setTimeout(() => setUploadState(''), 3000);
    } catch (err) {
      console.error(err);
      setUploadState('Upload failed');
    }
  };

  return (
    <div className="w-80 h-full glass-panel flex flex-col relative z-10 m-4 overflow-hidden border border-white/10 shadow-2xl">
      {/* Header */}
      <div className="p-5 border-b border-white/10 flex items-center gap-3 bg-white/5">
        <div className="p-2 bg-neon/20 rounded-lg">
          <MapIcon className="text-neon" size={24} />
        </div>
        <div>
          <h1 className="font-bold text-lg tracking-wide text-white">FUSION DASH</h1>
          <p className="text-xs text-neon/80 uppercase tracking-widest font-semibold">Intelligence Intel</p>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-5 space-y-8">
        
        {/* Search */}
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-gray-400 flex items-center gap-2">
            <Search size={16} /> SEARCH DATABASE
          </h2>
          <input 
            type="text" 
            placeholder="Search keywords, titles..." 
            className="w-full glass-input"
            value={filters.search}
            onChange={(e) => setFilters({...filters, search: e.target.value})}
          />
        </div>

        {/* Filters */}
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-gray-400 flex items-center gap-2">
            <Filter size={16} /> FILTER SOURCE
          </h2>
          <select 
            className="w-full glass-input bg-dark appearance-none"
            value={filters.sourceType}
            onChange={(e) => setFilters({...filters, sourceType: e.target.value})}
          >
            <option value="">All Sources</option>
            <option value="OSINT">OSINT</option>
            <option value="HUMINT">HUMINT</option>
            <option value="IMINT">IMINT</option>
          </select>
        </div>

        {/* Ingestion */}
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-gray-400 flex items-center gap-2">
            <Database size={16} /> DATA INGESTION
          </h2>
          
          <div className="p-4 bg-white/5 border border-white/10 rounded-lg">
            <form onSubmit={handleFileUpload} className="space-y-3">
              
              <input 
                type="text" 
                placeholder="Intelligence Title..." 
                className="w-full glass-input text-xs"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <textarea 
                placeholder="Add tactical description for AI analysis..." 
                className="w-full glass-input text-xs h-16 resize-none"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />

              <label className="block">
                <span className="sr-only">Choose file</span>
                <input 
                  id="fileInput"
                  type="file" 
                  accept=".csv,.json,.jpg,.jpeg,.png"
                  onChange={(e) => setFile(e.target.files[0])}
                  className="block w-full text-sm text-gray-400
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-md file:border-0
                    file:text-sm file:font-semibold
                    file:bg-neon/10 file:text-neon
                    hover:file:bg-neon/20 cursor-pointer"
                />
              </label>
              
              <div className="flex items-center gap-2 pt-2">
                <button 
                  type="submit" 
                  disabled={!file && !title}
                  className="w-full py-2 bg-neon/80 hover:bg-neon text-dark font-bold rounded flex items-center justify-center gap-2 disabled:opacity-50 transition-colors"
                >
                  <Upload size={16} />
                  UPLOAD
                </button>
              </div>
              {uploadState && (
                <p className={`text-xs text-center font-semibold mt-2 ${uploadState === 'Success!' ? 'text-green-400' : uploadState.includes('failed') ? 'text-red-400' : 'text-neon animate-pulse'}`}>
                  {uploadState}
                </p>
              )}
            </form>

            <div className="mt-4 flex gap-2 justify-center text-gray-500">
              <FileJson size={18} />
              <span className="text-xs">CSV</span>
              <span className="text-xs">•</span>
              <ImageIcon size={18} />
            </div>
          </div>
        </div>

      </div>
      
      {/* Footer status */}
      <div className="p-3 border-t border-white/10 text-center text-xs text-gray-500 flex justify-between px-5 items-center">
        <span>System Status: <span className="text-neon inline-block w-2 h-2 rounded-full bg-neon shadow-[0_0_8px_#00f0ff]"></span></span>
        <span>v1.0.0</span>
      </div>
    </div>
  );
};

export default Sidebar;
