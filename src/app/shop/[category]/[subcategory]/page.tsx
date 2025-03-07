interface Props {
  params: {
    category: string;
    subcategory: string;
  };
}

export default function SubcategoryPage({ params }: Props) {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-8 capitalize">
        {params.subcategory.replace(/-/g, ' ')}
      </h1>
      {/* Add subcategory content here */}
    </div>
  );
} 