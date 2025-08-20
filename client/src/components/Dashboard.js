import React from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout';

// Import all widgets
import WeatherWidget from './widgets/WeatherWidget';
import StocksWidget from './widgets/StocksWidget';
import NewsWidget from './widgets/NewsWidget';
import TwitterWidget from './widgets/TwitterWidget';
import TaskListWidget from './widgets/TaskListWidget';
import CalendarWidget from './widgets/CalendarWidget';
import Widget from './Widget'; // Import the base Widget

const ResponsiveGridLayout = WidthProvider(Responsive);

const Dashboard = ({ layout, onLayoutChange, onRemoveWidget }) => {
  // A map to easily render widgets by their key (string name)
  const widgetComponents = {
    weather: { component: WeatherWidget, title: 'Weather' },
    stocks: { component: StocksWidget, title: 'Stocks' },
    news: { component: NewsWidget, title: 'News' },
    twitter: { component: TwitterWidget, title: 'Twitter Feed' },
    taskList: { component: TaskListWidget, title: 'Task List' },
    calendar: { component: CalendarWidget, title: 'Calendar' },
  };

  return (
    <ResponsiveGridLayout
      className="layout"
      layouts={{ lg: layout }}
      breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
      cols={{ lg: 84, md: 60, sm: 36, xs: 12, xxs: 6 }}
      rowHeight={20}
      onLayoutChange={onLayoutChange}
      draggableHandle=".MuiCardHeader-root"
      preventCollision={true}
    >
      {layout.map((item) => {
        const widgetInfo = widgetComponents[item.i];
        if (!widgetInfo) {
          return <div key={item.i} data-grid={item}>Widget '{item.i}' not found</div>;
        }
        const WidgetComponent = widgetInfo.component;
        return (
          <div key={item.i} data-grid={item} style={{ display: 'flex' }}>
            <Widget title={widgetInfo.title} onRemove={() => onRemoveWidget(item.i)}>
              <WidgetComponent />
            </Widget>
          </div>
        );
      })}
    </ResponsiveGridLayout>
  );
};

export default Dashboard;
