"use client";

import {ShoppingBag} from "lucide-react";
import {useTranslations} from "next-intl";
import {Button} from "@/components/ui/button";
import {useCartStore} from "@/features/cart/cart-store";
import type {Locale} from "@/i18n/routing";
import type {Product} from "@/lib/content";
import {localized} from "@/lib/content";
import gsap from "gsap";

type Props = {
  product: Product;
  locale: Locale;
  quantity?: number;
  variant?: "default" | "forest" | "outline" | "light";
  label?: string;
  className?: string;
};

export function AddToCartButton({
  product,
  locale,
  quantity = 1,
  variant = "default",
  label,
  className
}: Props) {
  const t = useTranslations("Common");
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
    // 1. Thêm vào giỏ
    addItem(
      {
        slug: product.slug,
        name: localized(product.name, locale),
        price: product.price,
        image: product.images[0],
        weight: product.weight,
        category: product.category,
        notes: localized(product.notes, locale)
      },
      quantity
    );

    // 2. Hiệu ứng bay vào giỏ hàng
    const button = e.currentTarget;
    const cartIcon = document.getElementById("global-cart-icon");

    if (cartIcon && typeof window !== "undefined") {
      // Tìm thẻ (card) bọc ngoài cùng của sản phẩm
      const card = button.closest(".group") as HTMLElement;
      
      let startX = e.clientX;
      let startY = e.clientY;
      let startWidth = 100;
      let startHeight = 150;

      if (card) {
        const rect = card.getBoundingClientRect();
        startX = rect.left;
        startY = rect.top;
        startWidth = rect.width;
        startHeight = rect.height;
      }

      const cartRect = cartIcon.getBoundingClientRect();
      const endX = cartRect.left + cartRect.width / 2;
      const endY = cartRect.top + cartRect.height / 2;

      // Clone toàn bộ card sản phẩm
      let clone: HTMLElement;
      if (card) {
        clone = card.cloneNode(true) as HTMLElement;
        clone.style.margin = "0";
      } else {
        clone = document.createElement("img");
        (clone as HTMLImageElement).src = product.images[0];
      }
      
      clone.style.position = "fixed";
      clone.style.left = `${startX}px`;
      clone.style.top = `${startY}px`;
      clone.style.width = `${startWidth}px`;
      clone.style.height = `${startHeight}px`;
      clone.style.zIndex = "9999";
      clone.style.pointerEvents = "none";
      clone.style.transition = "none";
      
      // Thu nhỏ một chút ban đầu và thêm đổ bóng
      gsap.set(clone, { 
        scale: 1, 
        opacity: 1,
        boxShadow: "0 30px 60px rgba(0,0,0,0.2)"
      });
      document.body.appendChild(clone);

      // Hiệu ứng GSAP mượt mà: Tách X và Y để tạo đường cong (Arc)
      
      // X di chuyển đều đặn
      gsap.to(clone, {
        x: endX - startX - startWidth / 2,
        duration: 0.8,
        ease: "power2.inOut"
      });

      // Y rớt nhẹ rồi cong lên
      gsap.to(clone, {
        y: endY - startY - startHeight / 2,
        scale: 0.05, // Thu nhỏ dần về kích thước icon
        opacity: 0.3,
        duration: 0.8,
        ease: "power2.in", // Cong về phía giỏ hàng
        onComplete: () => {
          clone.remove();
          
          // Tạo hiệu ứng giật nảy (bump) cho icon giỏ hàng khi nhận được sản phẩm
          gsap.fromTo(
            cartIcon,
            { scale: 1 },
            { scale: 1.25, duration: 0.15, yoyo: true, repeat: 1, ease: "back.out(2)" }
          );
        }
      });
    }
  };

  return (
    <Button
      className={className}
      variant={variant}
      onClick={handleAddToCart}
    >
      <ShoppingBag className="h-4 w-4" aria-hidden="true" />
      {label ?? t("addToCart")}
    </Button>
  );
}
