# Users

users

- id (uuid)
- name
- email
- phone
- role
- avatar_url
- created_at
- updated_at

---

# Addresses

addresses

- id (uuid)
- user_id
- name
- phone
- district
- upazila
- address
- postal_code
- is_default
- created_at

---

# Categories

categories

- id
- name
- slug
- description
- image

---

# Collections

collections

- id
- name
- slug
- description
- banner
- is_featured

---

# Products

products

- id
- name
- slug
- sku
- description
- price
- discount_price
- stock
- category_id
- collection_id
- is_featured
- is_best_seller
- is_new_arrival
- seo_title
- seo_description
- created_at
- updated_at

---

# Product Images

product_images

- id
- product_id
- url
- sort_order

---

# Orders

orders

- id
- user_id
- order_number
- status
- subtotal
- delivery_charge
- discount
- total
- payment_method
- payment_status
- shipping_address_id
- transaction_id
- created_at
- updated_at

---

# Order Items

order_items

- id
- order_id
- product_id
- price
- quantity

---

# Coupons

coupons

- id
- code
- type
- value
- minimum_amount
- start_date
- end_date
- is_active

---

# Reviews

reviews

- id
- user_id
- product_id
- rating
- comment
- created_at

---

# Wishlist

wishlist

- id
- user_id
- product_id
- created_at

---

# Banners

banners

- id
- title
- image
- link
- sort_order
- is_active

---

# Contact Messages

contact_messages

- id
- name
- email
- phone
- message
- created_at
