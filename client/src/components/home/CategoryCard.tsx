import Link from 'next/link';
import { HiArrowRight } from 'react-icons/hi';

interface Category {
  id: string;
  name: string;
  description: string;
  color: string;
  services: string[];
}

interface CategoryCardProps {
  category: Category;
}

export function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link 
      href={`/search?category=${category.id}`}
      className="card-hover group p-6"
    >
      <div className={`w-full h-2 rounded-full bg-gradient-to-r ${category.color} mb-4`}></div>
      <h3 className="font-display font-semibold text-xl mb-2 text-gray-900 group-hover:text-primary-600 transition-colors">
        {category.name}
      </h3>
      <p className="text-gray-600 text-sm mb-4">
        {category.description}
      </p>
      <div className="flex flex-wrap gap-2 mb-4">
        {category.services.slice(0, 3).map((service) => (
          <span key={service} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
            {service}
          </span>
        ))}
        {category.services.length > 3 && (
          <span className="text-xs text-gray-400">+{category.services.length - 3} more</span>
        )}
      </div>
      <div className="flex items-center text-primary-600 font-medium text-sm group-hover:gap-2 transition-all">
        <span>Explore</span>
        <HiArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
      </div>
    </Link>
  );
}
