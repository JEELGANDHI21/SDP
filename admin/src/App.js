import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Header from './components/Header';
import ProductList from './components/ProductList';
import User from './components/User';
import Home from './components/Home';
import SoldProduct from './components/SoldProduct';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Header />
        <Routes>
          <Route path='/productlist' element={<ProductList />}/>
          <Route path='/users' element={<User />}/>
          <Route path='/home' element={<Home />}/>
          <Route path='/soldproduct' element={<SoldProduct />}/>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
