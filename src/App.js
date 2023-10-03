
import { Outlet } from 'react-router-dom';
import './App.css';
import Header from './pages/Header';

function App() {
  return (
    <>
      <Header login="false" />
      <Outlet></Outlet>
    </>
  );
}

export default App;
