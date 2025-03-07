interface Props {
  params: {
    category: string;
  };
}

export default function CategoryPage({ params }: Props) {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-8 capitalize">
        {params.category.replace(/-/g, ' ')}
      </h1>
      {/* Add category content here */}
    </div>
  );
} 