import { useEffect } from "react";
import ProductCard from "../components/NewProductCard";
import { productAtom, userAtom } from "../atoms/store";
import { useAtom } from "jotai";

export default function NewProductCardPage() {
  const [products, setProducts] = useAtom(productAtom);
  const [user] = useAtom(userAtom);

  const fetchData = async () => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const searchQuery = urlParams.toString();
      const res = await fetch(
        `${process.env.REACT_APP_BASE_URL}api/product/getall?${searchQuery}`
      );
      const data = await res.json();
      setProducts(data);
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    fetchData();
  }, [window.location.search]);

  const handleLike = async ({ e, id }) => {
    e.preventDefault();
    try {
      const res = await fetch(
        `${process.env.REACT_APP_BASE_URL}api/product/like/${id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId: user._id, name: user.name }),
        }
      );
      const data = await res.json();
      if (data.success === false) {
        return;
      }
      return data.message;
    } catch (error) {
      console.log(error.message);
    } finally {
      fetchData();
    }
  };

  return (
    <main className="container mx-auto flex items-center justify-center px-4 py-8 lg:ml-64 mt-10">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {products?.map((product, index) => (
          <ProductCard key={index} product={product} isLiked={handleLike} />
        ))}
      </div>
    </main>
  );
}
