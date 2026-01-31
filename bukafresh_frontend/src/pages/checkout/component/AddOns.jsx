import { Plus, Minus, ShoppingCart, AlertCircle, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCheckoutContext } from "@/features/checkout/store/CheckoutContext";
import { mockProducts } from "@/data/mockProducts";
import { Product, OrderItem } from "@/types";
import { cn } from "@/lib/utils";

export const AddOns = () => {
  const { addOns, addAddOn, removeAddOn, updateAddOnQuantity, getAddOnsTotal } =
    useCheckoutContext();

  const getQuantity = (productId: string) => {
    const item = addOns.find((a) => a.productId === productId);
    return item?.quantity || 0;
  };

  const handleAddItem = (product: Product) => {
    const item: OrderItem = {
      id: `addon-${product.id}-${Date.now()}`,
      productId: product.id,
      name: product.name,
      quantity: 1,
      unit: product.unit,
      price: product.price,
      image: product.image,
    };
    addAddOn(item);
  };

  const handleUpdateQuantity = (productId: string, delta: number) => {
    const item = addOns.find((a) => a.productId === productId);
    if (item) {
      updateAddOnQuantity(item.id, item.quantity + delta);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const addOnTotal = getAddOnsTotal();
  const categories = [...new Set(mockProducts.map((p) => p.category))];

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-display font-bold text-foreground">
          Add Extra Items
        </h1>
        <p className="text-muted-foreground mt-2">
          Customize your order with additional groceries (optional)
        </p>
      </div>

      {/* Separate Payment Notice */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <p className="font-medium text-amber-800">
            Add-ons are paid separately
          </p>
          <p className="text-sm text-amber-700 mt-1">
            Add-on items are not included in your subscription. You&apos;ll pay
            for these items separately on delivery or via a separate invoice.
          </p>
        </div>
      </div>

      {/* Add-ons Summary */}
      {addOns.length > 0 && (
        <div className="bg-primary/5 rounded-xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
              <ShoppingCart className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <p className="font-medium text-foreground">
                {addOns.length} add-on items
              </p>
              <p className="text-sm text-muted-foreground">
                {addOns.reduce((sum, item) => sum + item.quantity, 0)} total
                items
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-lg font-bold text-primary">
              {formatPrice(addOnTotal)}
            </p>
            <p className="text-xs text-muted-foreground">Paid separately</p>
          </div>
        </div>
      )}

      {/* Products by Category */}
      {categories.map((category) => {
        const products = mockProducts.filter((p) => p.category === category);
        return (
          <div key={category} className="space-y-4">
            <h2 className="text-lg font-semibold text-foreground capitalize">
              {category}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.map((product) => {
                const quantity = getQuantity(product.id);
                const isInCart = quantity > 0;

                return (
                  <div
                    key={product.id}
                    className={cn(
                      "flex items-center gap-4 p-4 rounded-xl border transition-all",
                      isInCart
                        ? "border-primary bg-primary/5"
                        : "border-border bg-card",
                    )}
                  >
                    <div className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center shrink-0">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-foreground truncate">
                        {product.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {formatPrice(product.price)}/{product.unit}
                      </p>
                    </div>
                    <div className="shrink-0">
                      {isInCart ? (
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleUpdateQuantity(product.id, -1)}
                          >
                            <Minus className="w-4 h-4" />
                          </Button>
                          <span className="w-8 text-center font-medium">
                            {quantity}
                          </span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleUpdateQuantity(product.id, 1)}
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleAddItem(product)}
                        >
                          <Plus className="w-4 h-4 mr-1" />
                          Add
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}

      {/* Skip Message */}
      <div className="text-center py-4 flex items-center justify-center gap-2 text-muted-foreground">
        <Info className="w-4 h-4" />
        <p>
          Don&apos;t need extras? No problem! Click &quot;Continue&quot; to
          proceed without add-ons.
        </p>
      </div>
    </div>
  );
};
