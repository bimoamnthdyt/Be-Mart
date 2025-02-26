import ProductList from "./components/ProductList";
import Navbar from "./components/Navbar";

function App() {
  return (
    <div className="bg-gray-100 min-h-screen p-5">
      <Navbar/>
      <ProductList />
    </div>
  );
}

export default App;