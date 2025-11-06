import {
  lazy,
  Suspense,
  useState,
  type JSX,
  type LazyExoticComponent,
} from 'react';

const FileTask = lazy(() =>
  import('./task-1/file-task').then((m) => ({ default: m.FileTask }))
);
const PeselTask = lazy(() =>
  import('./task-2/pesel-task').then((m) => ({ default: m.PeselTask }))
);
const ApiTask = lazy(() =>
  import('./task-3/api-task').then((m) => ({ default: m.ApiTask }))
);

type Tab = {
  key: 'file' | 'pesel' | 'api';
  label: string;
  Component: LazyExoticComponent<() => JSX.Element>;
};

const tabs: Tab[] = [
  { key: 'file', label: 'File Task', Component: FileTask },
  { key: 'pesel', label: 'PESEL Task', Component: PeselTask },
  { key: 'api', label: 'API Task', Component: ApiTask },
];

export function App() {
  const [activeTab, setActiveTab] = useState<Tab['key']>(tabs[0].key);
  const ActiveComponent = tabs.find((tab) => tab.key === activeTab)?.Component;

  return (
    <main>
      <div
        role='tablist'
        aria-label='Task Tabs'
        style={{ marginBottom: '1rem' }}>
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            style={{
              fontWeight: activeTab === tab.key ? 'bold' : 'normal',
              marginRight: '0.5rem',
            }}
            role='tab'
            id={`tab-${tab.key}`}
            aria-controls={`panel-${tab.key}`}
            aria-selected={activeTab === tab.key}>
            {tab.label}
          </button>
        ))}
      </div>
      <Suspense fallback={<div>Loading...</div>}>
        {ActiveComponent && (
          <div
            role='tabpanel'
            aria-labelledby={`tab-${activeTab}`}
            id={`panel-${activeTab}`}
            tabIndex={0}>
            <ActiveComponent />
          </div>
        )}
      </Suspense>
    </main>
  );
}
