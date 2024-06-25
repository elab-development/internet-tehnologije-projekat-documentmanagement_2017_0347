import React from 'react';
import axios from 'axios';
import { useState, useEffect } from "react";

function TagBar({ filterDocs }) {
  const [tags, setTags] = useState([]);
  const [selectedTag, setSelectedTag] = useState("all");
  const [areTagsLoaded, setAreTagsLoaded] = useState(false);

  useEffect(() => {
    loadTags();
  }, []);
  const loadTags = async () => {
    try {
      const response = await axios.get('api/tags');
      setTags(response.data);
      setAreTagsLoaded(true);
    } catch (error) {
      console.log(error);
    }
  }

  const handleTagChange = (event) => {
    setSelectedTag(event.target.value);
    filterDocs(event.target.value)
  };

  return (
    <div className='tag-container '>
      <p className='tag-search'>Search by tag:</p>
      {areTagsLoaded && (
        <label className="tag-label">
          <input
            type="radio"
            name="tag"
            key="0"
            value="all"
            checked={selectedTag === "all"}
            onChange={handleTagChange}
          />
          <span className='tag-text-color'> All </span>
        </label>)}
      {tags.map(tag => (
        <label key={tag.id} className="tag-label">
          <input
            type="radio"
            name="tag"
            key={tag.id}
            value={tag.id}
            checked={selectedTag == tag.id}
            onChange={handleTagChange}
          />
          <span className='tag-text-color'> {tag.keyword}</span>
        </label>
      ))}
      {/* <button type="submit" onClick={() => filterDocs(selectedTag)}>Apply</button> */}
    </div>
  )
}

export default TagBar
