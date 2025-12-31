import { Eye, Edit2, Trash2, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface JewelryCardProps {
  id: string | number;
  name: string;
  category: string;
  purity: string;
  weight: string;
  price: string;
  image: string;
  status: "active" | "inactive";
}

export function JewelryCard({ id, name, category, purity, weight, price, image, status }: JewelryCardProps) {
  return (
    <div className="glass-card-elevated overflow-hidden group hover:shadow-gold transition-all duration-300">
      {/* Image */}
      <div className="relative h-48 bg-gradient-to-br from-cream to-cream-dark overflow-hidden">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 right-3">
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
            status === 'active' 
              ? 'bg-emerald-100 text-emerald-700' 
              : 'bg-secondary text-muted-foreground'
          }`}>
            {status === 'active' ? 'Active' : 'Inactive'}
          </span>
        </div>
        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-foreground/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
          <Button variant="glass" size="icon" className="h-9 w-9">
            <Eye className="w-4 h-4" />
          </Button>
          <Button variant="glass" size="icon" className="h-9 w-9">
            <Edit2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-serif text-lg font-semibold line-clamp-1">{name}</h3>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 -mr-2">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem><Eye className="w-4 h-4 mr-2" /> View Details</DropdownMenuItem>
              <DropdownMenuItem><Edit2 className="w-4 h-4 mr-2" /> Edit</DropdownMenuItem>
              <DropdownMenuItem className="text-destructive"><Trash2 className="w-4 h-4 mr-2" /> Delete</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex items-center gap-2 mb-3">
          <span className="px-2 py-0.5 text-xs font-medium bg-gold/10 text-gold rounded-full">
            {category}
          </span>
          <span className="text-xs text-muted-foreground">{purity}</span>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground">Weight</p>
            <p className="text-sm font-medium">{weight}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Price</p>
            <p className="text-lg font-serif font-bold gold-text">{price}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
