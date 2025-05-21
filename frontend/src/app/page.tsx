import Banner from "./components/Banner";
import GBSieuSale from "./components/ProductItem";
import ProductItem from "./components/ProductItem";

export default function HomePage() {
  return (
    <main>
      {/* <ProductItem/> */}
      <GBSieuSale/>
      <Banner/> 
    </main>
  );
}