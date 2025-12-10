import React, { useState, useMemo } from 'react';
import { MultiFiltersInput } from 'mantine-composite-filters';
import {
  Card,
  Title,
  Text,
  Stack,
  Group,
  Badge,
  SimpleGrid,
  Image,
  Box,
  Progress,
  ThemeIcon,
  Divider,
} from '@mantine/core';
import {
  IconShoppingCart,
  IconTag,
  IconStar,
  IconPackage,
  IconTruck,
} from '@tabler/icons-react';
import type { ActiveFilter, FilterDefinition } from 'mantine-composite-filters';

const productFilters: FilterDefinition[] = [
  {
    key: 'name',
    label: 'Product Name',
    type: 'text',
    placeholder: 'Search products...',
    operators: ['contains', 'starts_with', '='],
    icon: <IconPackage size={14} />,
  },
  {
    key: 'category',
    label: 'Category',
    type: 'select',
    options: [
      { value: 'electronics', label: '📱 Electronics' },
      { value: 'clothing', label: '👕 Clothing' },
      { value: 'home', label: '🏠 Home & Garden' },
      { value: 'sports', label: '⚽ Sports & Outdoors' },
      { value: 'books', label: '📚 Books' },
      { value: 'toys', label: '🎮 Toys & Games' },
    ],
  },
  {
    key: 'price',
    label: 'Price ($)',
    type: 'number',
    placeholder: 'Enter price...',
    operators: ['=', '>', '<', '>=', '<='],
    icon: <IconTag size={14} />,
  },
  {
    key: 'rating',
    label: 'Rating',
    type: 'select',
    options: [
      { value: '5', label: '⭐⭐⭐⭐⭐ (5 stars)' },
      { value: '4', label: '⭐⭐⭐⭐ (4+ stars)' },
      { value: '3', label: '⭐⭐⭐ (3+ stars)' },
      { value: '2', label: '⭐⭐ (2+ stars)' },
    ],
    icon: <IconStar size={14} />,
  },
  {
    key: 'stock_status',
    label: 'Stock Status',
    type: 'select',
    options: [
      { value: 'in_stock', label: '✅ In Stock' },
      { value: 'low_stock', label: '⚠️ Low Stock' },
      { value: 'out_of_stock', label: '❌ Out of Stock' },
      { value: 'preorder', label: '📅 Pre-order' },
    ],
  },
  {
    key: 'brand',
    label: 'Brand',
    type: 'multi_select',
    options: [
      { value: 'apple', label: 'Apple' },
      { value: 'samsung', label: 'Samsung' },
      { value: 'nike', label: 'Nike' },
      { value: 'sony', label: 'Sony' },
      { value: 'adidas', label: 'Adidas' },
      { value: 'lg', label: 'LG' },
    ],
  },
  {
    key: 'shipping',
    label: 'Shipping',
    type: 'multi_select',
    options: [
      { value: 'free', label: '🚚 Free Shipping' },
      { value: 'prime', label: '⚡ Prime Delivery' },
      { value: 'same_day', label: '📦 Same Day' },
      { value: 'international', label: '🌍 International' },
    ],
    icon: <IconTruck size={14} />,
  },
  {
    key: 'added_date',
    label: 'Added Date',
    type: 'date_range',
  },
];

// Mock products data
const mockProducts = [
  { id: 1, name: 'iPhone 15 Pro', category: 'Electronics', price: 999, rating: 4.8, stock: 89, image: 'https://placehold.co/200x200/1a1a2e/ffffff?text=iPhone' },
  { id: 2, name: 'Nike Air Max', category: 'Clothing', price: 179, rating: 4.5, stock: 234, image: 'https://placehold.co/200x200/e94560/ffffff?text=Nike' },
  { id: 3, name: 'Sony WH-1000XM5', category: 'Electronics', price: 349, rating: 4.9, stock: 45, image: 'https://placehold.co/200x200/16213e/ffffff?text=Sony' },
  { id: 4, name: 'Yoga Mat Pro', category: 'Sports', price: 49, rating: 4.3, stock: 567, image: 'https://placehold.co/200x200/0f3460/ffffff?text=Yoga' },
  { id: 5, name: 'Smart Home Hub', category: 'Home', price: 129, rating: 4.1, stock: 12, image: 'https://placehold.co/200x200/533483/ffffff?text=Hub' },
  { id: 6, name: 'Gaming Controller', category: 'Toys', price: 69, rating: 4.6, stock: 0, image: 'https://placehold.co/200x200/e94560/ffffff?text=Game' },
];

function ProductCard({ product }: { product: typeof mockProducts[0] }) {
  const stockColor = product.stock > 50 ? 'green' : product.stock > 0 ? 'yellow' : 'red';
  const stockLabel = product.stock > 50 ? 'In Stock' : product.stock > 0 ? 'Low Stock' : 'Out of Stock';

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Card.Section>
        <Image src={product.image} height={140} alt={product.name} />
      </Card.Section>

      <Group justify="space-between" mt="md" mb="xs">
        <Text fw={500} lineClamp={1}>{product.name}</Text>
        <Badge color={stockColor} variant="light">{stockLabel}</Badge>
      </Group>

      <Text size="sm" c="dimmed" mb="xs">{product.category}</Text>

      <Group gap="xs" mb="sm">
        {[...Array(5)].map((_, i) => (
          <IconStar
            key={i}
            size={14}
            fill={i < Math.floor(product.rating) ? '#fab005' : 'transparent'}
            color="#fab005"
          />
        ))}
        <Text size="xs" c="dimmed">({product.rating})</Text>
      </Group>

      <Group justify="space-between" align="center">
        <Text size="xl" fw={700} c="blue">${product.price}</Text>
        <ThemeIcon variant="light" size="lg" radius="xl">
          <IconShoppingCart size={18} />
        </ThemeIcon>
      </Group>
    </Card>
  );
}

export function EcommerceProductsDemo() {
  const [filters, setFilters] = useState<ActiveFilter[]>([]);

  const filteredProducts = useMemo(() => {
    // In real app, this would filter based on actual filter values
    return filters.length > 0 
      ? mockProducts.slice(0, Math.max(1, mockProducts.length - filters.length))
      : mockProducts;
  }, [filters]);

  return (
    <Box p="xl" maw={1200} mx="auto">
      <Stack gap="xl">
        {/* Header */}
        <Group justify="space-between" align="flex-end">
          <div>
            <Title order={2}>🛒 Product Catalog</Title>
            <Text c="dimmed" size="sm">
              Browse and filter through thousands of products
            </Text>
          </div>
          <Badge size="lg" variant="filled" color="blue">
            {filteredProducts.length} products found
          </Badge>
        </Group>

        {/* Filter Bar */}
        <Card withBorder p="md" radius="md" bg="gray.0">
          <MultiFiltersInput
            filters={productFilters}
            value={filters}
            onChange={setFilters}
            placeholder="🔍 Filter products by name, category, price..."
            storageKeyPrefix="ecommerce-products"
          />
        </Card>

        {/* Stats Bar */}
        {filters.length > 0 && (
          <Card withBorder p="sm" radius="md">
            <Group gap="xl">
              <div>
                <Text size="xs" c="dimmed">Avg. Price</Text>
                <Text fw={600}>${Math.floor(filteredProducts.reduce((a, p) => a + p.price, 0) / filteredProducts.length)}</Text>
              </div>
              <Divider orientation="vertical" />
              <div>
                <Text size="xs" c="dimmed">Avg. Rating</Text>
                <Text fw={600}>{(filteredProducts.reduce((a, p) => a + p.rating, 0) / filteredProducts.length).toFixed(1)} ⭐</Text>
              </div>
              <Divider orientation="vertical" />
              <div>
                <Text size="xs" c="dimmed">Active Filters</Text>
                <Text fw={600}>{filters.length}</Text>
              </div>
            </Group>
          </Card>
        )}

        {/* Product Grid */}
        <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="md">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </SimpleGrid>

        {filteredProducts.length === 0 && (
          <Card withBorder p="xl" ta="center">
            <IconPackage size={48} color="gray" style={{ margin: '0 auto' }} />
            <Text size="lg" fw={500} mt="md">No products found</Text>
            <Text c="dimmed" size="sm">Try adjusting your filters</Text>
          </Card>
        )}
      </Stack>
    </Box>
  );
}
