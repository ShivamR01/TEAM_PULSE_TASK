import { Provider } from 'react-redux';
import { store } from './redux/store';
import Header from './components/Header';
import Dashboard from './components/Dashboard';

function App() {
  return (
    <Provider store={store}>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <Dashboard />
      </div>
    </Provider>
  );
}

export default App;
