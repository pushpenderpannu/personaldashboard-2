import React, { useState, useEffect } from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout';

// Import all widgets
import WeatherWidget from './widgets/WeatherWidget';
import StocksWidget from './widgets/StocksWidget';
import NewsWidget from './widgets/NewsWidget';
import TwitterWidget from './widgets/TwitterWidget';
import TaskListWidget from './widgets/TaskListWidget';
import CalendarWidget from './widgets/CalendarWidget';

const ResponsiveGridLayout = WidthProvider(Responsive);

const Dashboard = ({ config }) => {
  // A map to easily render widgets by their key (string name)
  const widgetComponents = {
    weather: WeatherWidget,
    stocks: StocksWidget,
    news: NewsWidget,
    twitter: TwitterWidget,
    taskList: TaskListWidget,
    calendar: CalendarWidget,
  };

  const [layout, setLayout] = useState([]);

  useEffect(() => {
    // Define a comprehensive initial layout
    const initialLayout = [
      { i: 'weather', x: 0, y: 0, w: 21, h: 7 },
      { i: 'stocks', x: 21, y: 0, w: 42, h: 14 },
      { i: 'news', x: 0, y: 7, w: 21, h: 7 },
      { i: 'twitter', x: 63, y: 0, w: 21, h: 28 },
      { i: 'taskList', x: 0, y: 14, w: 42, h: 14 },
      { i: 'calendar', x: 42, y: 14, w: 42, h: 14 },
    ];

    const savedLayout = localStorage.getItem('dashboardLayout');
    if (savedLayout && JSON.parse(savedLayout).length > 0) {
      setLayout(JSON.parse(savedLayout));
    } else {
      setLayout(initialLayout);
    }
  }, [config]);

  const handleLayoutChange = (newLayout) => {
    if (newLayout.length > 0) {
      localStorage.setItem('dashboardLayout', JSON.stringify(newLayout));
      setLayout(newLayout);
    }
  };

  return (
    <ResponsiveGridLayout
      className="layout"
      layouts={{ lg: layout }}
      breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
      cols={{ lg: 84, md: 60, sm: 36, xs: 12, xxs: 6 }}
      rowHeight={20} // Adjusted for a denser feel
      onLayoutChange={handleLayoutChange}
      draggableHandle=".MuiCardHeader-root"
    >
      {layout.map((item) => {
        const WidgetComponent = widgetComponents[item.i];
        return (
          <div key={item.i} data-grid={item} style={{ display: 'flex' }}>
            {WidgetComponent ? <WidgetComponent /> : <div>Widget '{item.i}' not found</div>}
          </div>
        );
      })}
    </ResponsiveGridLayout>
  );
};

export default Dashboard;
