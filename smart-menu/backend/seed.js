const { sequelize, User, Category, Meal, Feedback } = require('./models');
const dotenv = require('dotenv');
dotenv.config();

const seedDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connected to MySQL');

    // Force sync the database to drop and create tables
    await sequelize.sync({ force: true });
    console.log('Database schema created');

    const admin = await User.create({
      name: 'Admin',
      email: 'admin@smartmenu.com',
      password: 'admin123',
      role: 'admin',
    });
    const manager = await User.create({
      name: 'Manager',
      email: 'manager@smartmenu.com',
      password: 'manager123',
      role: 'manager',
    });
    await User.create({
      name: 'Sami',
      email: 'sami@gmail.com',
      password: 'sami123',
      role: 'admin',
    });
    await User.create({
      name: 'Cashier',
      email: 'cashier@smartmenu.com',
      password: 'cashier123',
      role: 'cashier',
    });
    console.log('Users created');

    const categories = await Category.bulkCreate([
      { name: 'Breakfast', description: 'Start your day right' },
      { name: 'Lunch', description: 'Midday meals' },
      { name: 'Dinner', description: 'Evening dining' },
      { name: 'Drinks', description: 'Refreshing beverages' },
      { name: 'Desserts', description: 'Sweet treats' },
      { name: 'Special Offers', description: 'Limited time deals' },
    ]);
    console.log('Categories created');

    await Meal.bulkCreate([
      {
        categoryId: categories[0].id,
        name: 'Chicken Burger',
        description: 'Fresh grilled chicken served with vegetables and sauce',
        ingredients: ['Chicken breast', 'Lettuce', 'Tomato', 'Onion', 'Burger bun', 'Mayonnaise'],
        preparationMethod: 'Grill chicken breast until golden brown. Toast burger bun. Assemble with lettuce, tomato, onion, and sauce.',
        calories: 550, protein: 28, carbohydrates: 45, fat: 18, price: 8, popularity: 120,
      },
      {
        categoryId: categories[0].id,
        name: 'Pancakes',
        description: 'Fluffy pancakes with maple syrup',
        ingredients: ['Flour', 'Eggs', 'Milk', 'Butter', 'Maple syrup', 'Berries'],
        preparationMethod: 'Mix batter, cook on griddle until golden, serve with syrup and berries.',
        calories: 350, protein: 10, carbohydrates: 55, fat: 12, price: 6, popularity: 95,
      },
      {
        categoryId: categories[1].id,
        name: 'Grilled Salmon',
        description: 'Atlantic salmon with herb butter',
        ingredients: ['Salmon fillet', 'Lemon', 'Garlic', 'Herbs', 'Butter', 'Asparagus'],
        preparationMethod: 'Season salmon, grill 4-5 min each side, serve with sautéed asparagus.',
        calories: 450, protein: 35, carbohydrates: 10, fat: 22, price: 15, popularity: 88,
      },
      {
        categoryId: categories[1].id,
        name: 'Caesar Salad',
        description: 'Classic Caesar with croutons and parmesan',
        ingredients: ['Romaine lettuce', 'Croutons', 'Parmesan', 'Caesar dressing', 'Chicken'],
        preparationMethod: 'Chop romaine, toss with dressing, top with croutons, parmesan, and grilled chicken.',
        calories: 320, protein: 25, carbohydrates: 18, fat: 20, price: 10, popularity: 75,
      },
      {
        categoryId: categories[2].id,
        name: 'Steak Dinner',
        description: 'Prime ribeye with mashed potatoes',
        ingredients: ['Ribeye steak', 'Potatoes', 'Butter', 'Rosemary', 'Garlic', 'Green beans'],
        preparationMethod: 'Season steak, sear in cast iron, finish in oven. Serve with mashed potatoes and green beans.',
        calories: 700, protein: 45, carbohydrates: 35, fat: 38, price: 22, popularity: 150,
      },
      {
        categoryId: categories[2].id,
        name: 'Pasta Alfredo',
        description: 'Creamy fettuccine alfredo',
        ingredients: ['Fettuccine', 'Heavy cream', 'Parmesan', 'Garlic', 'Butter', 'Parsley'],
        preparationMethod: 'Cook pasta al dente. Reduce cream with garlic and parmesan. Toss with pasta.',
        calories: 580, protein: 18, carbohydrates: 60, fat: 30, price: 12, popularity: 65,
      },
      {
        categoryId: categories[3].id,
        name: 'Fresh Orange Juice',
        description: 'Freshly squeezed orange juice',
        ingredients: ['Fresh oranges'],
        preparationMethod: 'Squeeze fresh oranges and serve chilled.',
        calories: 120, protein: 2, carbohydrates: 28, fat: 0, price: 4, popularity: 200,
      },
      {
        categoryId: categories[3].id,
        name: 'Mango Smoothie',
        description: 'Creamy mango smoothie',
        ingredients: ['Mango', 'Yogurt', 'Honey', 'Ice'],
        preparationMethod: 'Blend all ingredients until smooth. Serve chilled.',
        calories: 200, protein: 5, carbohydrates: 40, fat: 3, price: 5, popularity: 110,
      },
      {
        categoryId: categories[4].id,
        name: 'Chocolate Lava Cake',
        description: 'Warm chocolate cake with molten center',
        ingredients: ['Dark chocolate', 'Butter', 'Eggs', 'Sugar', 'Flour', 'Vanilla ice cream'],
        preparationMethod: 'Bake individual cakes until edges set but center is molten. Serve with ice cream.',
        calories: 400, protein: 6, carbohydrates: 48, fat: 22, price: 7, popularity: 180,
      },
      {
        categoryId: categories[5].id,
        name: 'Family Feast Deal',
        description: '2 burgers, 2 fries, 2 drinks + dessert',
        ingredients: ['Burger', 'Fries', 'Soft drink', 'Dessert'],
        preparationMethod: 'Includes choice of any 2 burgers, 2 portions of fries, 2 drinks, and 1 dessert.',
        calories: 1200, protein: 50, carbohydrates: 120, fat: 55, price: 25, popularity: 60,
      },
    ]);
    console.log('Meals created');

    await Feedback.bulkCreate([
      { customerName: 'John Doe', rating: 5, comment: 'Amazing food and great service!' },
      { customerName: 'Jane Smith', rating: 4, comment: 'Loved the chicken burger. Will come again.' },
      { customerName: 'Bob Wilson', rating: 3, comment: 'Good food but service was slow.' },
    ]);
    console.log('Feedbacks created');

    console.log('\n--- Seed Data Summary ---');
    console.log('Admin: admin@smartmenu.com / admin123');
    console.log('Manager: manager@smartmenu.com / manager123');
    console.log('Sami: sami@gmail.com / sami123');
    console.log('Cashier: cashier@smartmenu.com / cashier123');
    console.log('Database seeded successfully!');

    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seedDB();
