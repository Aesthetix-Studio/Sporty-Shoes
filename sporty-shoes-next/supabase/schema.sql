-- ============================================================
-- Sporty Shoes – Supabase Schema
-- Paste this into Supabase SQL Editor and run it.
-- ============================================================

-- Products
create table if not exists products (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  brand       text not null,
  category    text not null,
  price       numeric(10,2) not null,
  image_url   text not null default '',
  description text not null default '',
  stock       int  not null default 0,
  created_at  timestamptz not null default now()
);

-- Orders
create table if not exists orders (
  id               uuid primary key default gen_random_uuid(),
  user_id          uuid not null references auth.users(id) on delete cascade,
  total            numeric(10,2) not null,
  status           text not null default 'pending'
                     check (status in ('pending','confirmed','shipped','delivered')),
  shipping_address jsonb not null default '{}',
  created_at       timestamptz not null default now()
);

-- Order items
create table if not exists order_items (
  id         uuid primary key default gen_random_uuid(),
  order_id   uuid not null references orders(id) on delete cascade,
  product_id uuid not null references products(id),
  quantity   int  not null check (quantity > 0),
  price      numeric(10,2) not null
);

-- ============================================================
-- Row Level Security
-- ============================================================
alter table products    enable row level security;
alter table orders      enable row level security;
alter table order_items enable row level security;

-- Products: anyone can read, only service role can write
create policy "products_select" on products for select using (true);
create policy "products_insert" on products for insert with check (auth.role() = 'service_role');
create policy "products_update" on products for update using (auth.role() = 'service_role');
create policy "products_delete" on products for delete using (auth.role() = 'service_role');

-- Orders: users can read/create their own orders
create policy "orders_select" on orders for select using (auth.uid() = user_id);
create policy "orders_insert" on orders for insert with check (auth.uid() = user_id);

-- Order items: users can read items belonging to their orders
create policy "order_items_select" on order_items
  for select using (
    exists (select 1 from orders where orders.id = order_items.order_id and orders.user_id = auth.uid())
  );
create policy "order_items_insert" on order_items
  for insert with check (
    exists (select 1 from orders where orders.id = order_items.order_id and orders.user_id = auth.uid())
  );

-- ============================================================
-- Seed data (sample products)
-- ============================================================
insert into products (name, brand, category, price, image_url, description, stock) values
  ('Air Max 270',      'Nike',    'Running',   129.99, 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600', 'Lightweight running shoe with Max Air unit.', 50),
  ('Ultra Boost 22',  'Adidas',  'Running',   179.99, 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=600', 'Responsive Boost midsole for all-day comfort.', 40),
  ('Chuck Taylor All Star', 'Converse', 'Casual', 59.99, 'https://images.unsplash.com/photo-1463100099107-aa0980c362e6?w=600', 'Classic canvas high-top sneaker.', 80),
  ('Old Skool',        'Vans',    'Casual',    69.99, 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=600', 'Iconic side-stripe skate shoe.', 60),
  ('Gel-Kayano 30',   'Asics',   'Running',   159.99, 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600', 'Premium stability running shoe.', 35),
  ('Suede Classic',   'Puma',    'Casual',    79.99, 'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=600', 'Timeless suede sneaker.', 45),
  ('React Infinity',  'Nike',    'Training',  149.99, 'https://images.unsplash.com/photo-1539185441755-769473a23570?w=600', 'Designed to help reduce injury.', 30),
  ('Forum Low',       'Adidas',  'Casual',    89.99, 'https://images.unsplash.com/photo-1587563871167-1ee9c731aefb?w=600', 'Basketball-inspired street style.', 55)
on conflict do nothing;
