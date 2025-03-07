interface Props {
  params: {
    category: string;
    subcategory: string;
    product: string;
  };
}

export default function ProductPage({ params }: Props) {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-8 capitalize">
        {params.product.replace(/-/g, ' ')}
      </h1>
      {/* Add product content here */}
    </div>
  );
} 