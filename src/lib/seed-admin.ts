import bcrypt from 'bcryptjs';
import { connectToDatabase } from '@/lib/db';
import { User } from '@/models/User';
import { Category } from '@/models/Category';
import { Collection } from '@/models/Collection';

export async function seedAdminUser() {
  try {
    await connectToDatabase();

    const adminEmail = 'admin@gmail.com';
    const existingAdmin = await User.findOne({ email: adminEmail });

    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await User.create({
        name: 'Nobab Admin',
        email: adminEmail,
        password: hashedPassword,
        phone: '01712345678',
        role: 'admin',
      });
      console.log('Successfully seeded default ADMIN user: admin@gmail.com');
    }

    // Seed initial categories if empty
    const categoryCount = await Category.countDocuments();
    if (categoryCount === 0) {
      await Category.insertMany([
        { id: 1, name: 'Premium Cotton Lungi', slug: 'lungi-premium-cotton', description: 'Finest quality cotton lungis.', parent_type: 'lungi', sort_order: 1 },
        { id: 2, name: 'Export Quality Lungi', slug: 'lungi-export-quality', description: 'Lungis meeting export standards.', parent_type: 'lungi', sort_order: 2 },
        { id: 3, name: 'Check Lungi', slug: 'lungi-check', description: 'Classic check-pattern lungis.', parent_type: 'lungi', sort_order: 3 },
        { id: 4, name: 'Printed Lungi', slug: 'lungi-printed', description: 'Vibrant printed lungis.', parent_type: 'lungi', sort_order: 4 },
        { id: 5, name: 'Handloom Lungi', slug: 'lungi-handloom', description: 'Authentic handwoven lungis.', parent_type: 'lungi', sort_order: 5 },
        { id: 6, name: 'Cotton Saree', slug: 'saree-cotton', description: 'Lightweight cotton sarees.', parent_type: 'saree', sort_order: 1 },
        { id: 7, name: 'Jamdani Saree', slug: 'saree-jamdani', description: 'UNESCO heritage Jamdani sarees.', parent_type: 'saree', sort_order: 2 },
        { id: 8, name: 'Silk Saree', slug: 'saree-silk', description: 'Luxurious silk sarees.', parent_type: 'saree', sort_order: 3 },
        { id: 9, name: 'Printed Saree', slug: 'saree-printed', description: 'Contemporary printed sarees.', parent_type: 'saree', sort_order: 4 },
        { id: 10, name: 'Handloom Saree', slug: 'saree-handloom', description: 'Hand-woven sarees.', parent_type: 'saree', sort_order: 5 },
      ]);
      console.log('Successfully seeded initial categories.');
    }

    // Seed initial collections if empty
    const collectionCount = await Collection.countDocuments();
    if (collectionCount === 0) {
      await Collection.insertMany([
        { id: 1, name: 'Eid Special', slug: 'eid-special', description: 'Exclusive Eid collection.', is_featured: true, sort_order: 1 },
        { id: 2, name: 'Summer Collection', slug: 'summer-collection', description: 'Lightweight summer fabrics.', is_featured: true, sort_order: 2 },
        { id: 3, name: 'New Arrivals', slug: 'new-arrivals', description: 'Latest additions.', is_featured: true, sort_order: 3 },
      ]);
      console.log('Successfully seeded initial collections.');
    }
  } catch (error) {
    console.error('Error seeding admin user and initial data:', error);
  }
}
