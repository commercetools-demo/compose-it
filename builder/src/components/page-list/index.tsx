import React, { useState } from 'react';
import { PageConfig } from '../library/general';

interface PageListProps {
  pages: PageConfig[];
  onAddPage: (page: PageConfig) => void;
  onSelectPage: (pageId: string) => void;
  currentPageId: string | null;
}

const PageList: React.FC<PageListProps> = ({ pages, onAddPage, onSelectPage, currentPageId }) => {
  const [newPageName, setNewPageName] = useState('');

  const handleAddPage = () => {
    if (newPageName) {
      const newPage: PageConfig = {
        id: Date.now().toString(),
        route: `/${newPageName.toLowerCase().replace(/\s+/g, '-')}`,
        layout: { type: 'grid', columns: 12 },
        components: [],
      };
      onAddPage(newPage);
      setNewPageName('');
    }
  };

  return (
    <div className="page-list">
      <h2>Pages</h2>
      <ul>
        {pages.map(page => (
          <li 
            key={page.id} 
            onClick={() => onSelectPage(page.id)}
            className={page.id === currentPageId ? 'active' : ''}
          >
            {page.route}
          </li>
        ))}
      </ul>
      <div>
        <input
          type="text"
          value={newPageName}
          onChange={(e) => setNewPageName(e.target.value)}
          placeholder="New page name"
        />
        <button onClick={handleAddPage}>Add Page</button>
      </div>
    </div>
  );
};

export default PageList;