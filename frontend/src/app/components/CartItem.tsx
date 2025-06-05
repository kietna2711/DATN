'use client';
import { CartItem as CartItemType } from '@/app/types/cartD';
import styles from '@/app/styles/cart.module.css';
import { useAppDispatch } from "../store/store";
import { updateQuantity, removeFromCart, updateVariant } from "../store/features/cartSlice";

interface CartItemProps {
  item: CartItemType;
}

export default function CartItem({ item }: CartItemProps) {
  const dispatch = useAppDispatch();
  const { product, quantity, selectedVariant } = item;
  const hasVariants = Array.isArray(product.variants) && product.variants.length > 0;
  const currentSize = selectedVariant?.size || '';

  const handleSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSize = e.target.value;
    const newVariant = product.variants.find(v => v.size === newSize);
    if (!newVariant) return;
    dispatch(updateVariant({
      _id: product._id,
      oldSize: currentSize,
      newVariant,
    }));
  };

  const price = selectedVariant ? selectedVariant.price : product.price;

  return (
    <tr>
      <td className={styles.product}>
        <a href={`/products/${product._id}`} style={{ display: 'flex', alignItems: 'center', gap: 14, textDecoration: 'none', color: 'inherit' }}>
          <img src={`http://localhost:3000/images/${product.images[0]}`} alt={product.name} className={styles.productImg} />
          <p>{product.name}</p>
        </a>
      </td>
      <td>
        {hasVariants ? (
          <select value={currentSize} onChange={handleSizeChange} className={styles.sizeSelect}>
            {product.variants.map((v) => (
              <option value={v.size} key={v.size}>{v.size}</option>
            ))}
          </select>
        ) : (
          <span>-</span>
        )}
      </td>
      <td className={styles.price}>
        <span>{Number(price).toLocaleString('vi-VN')} ₫</span>
      </td>
      <td className={styles.quantity}>
        <div className={styles.quantityControls}>
          <button
            onClick={() => {
              if (quantity > 1) {
                dispatch(updateQuantity({ _id: product._id, quantity: quantity - 1, size: currentSize }));
              } else {
                dispatch(removeFromCart({ _id: product._id, size: currentSize }));
              }
            }}
          >-</button>
          <input type="text" value={quantity} readOnly />
          <button onClick={() => dispatch(updateQuantity({ _id: product._id, quantity: quantity + 1, size: currentSize }))}>+</button>
        </div>
      </td>
      <td className={styles.totalPrice}>
        {(Number(price) * quantity).toLocaleString('vi-VN')} ₫
      </td>
      <td className={styles.remove}>
        <button onClick={() => dispatch(removeFromCart({ _id: product._id, size: currentSize }))}>
          Xóa
        </button>
      </td>
    </tr>
  );
}