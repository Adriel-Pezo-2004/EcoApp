-- MongoDB Atlas Database Seeding Script
-- This script creates sample data for the EcoQuiz application

-- Note: This is a reference SQL script. 
-- In MongoDB, we'll use JavaScript/TypeScript to seed the data
-- The actual seeding will be done through Prisma Client

-- Sample Categories
INSERT INTO categories (name, description, icon, color) VALUES
('Reciclaje Básico', 'Conceptos fundamentales del reciclaje', 'recycle', '#4caf50'),
('Plásticos', 'Todo sobre el reciclaje de plásticos', 'bottle', '#2196f3'),
('Papel y Cartón', 'Reciclaje de materiales de papel', 'file-text', '#ff9800'),
('Vidrio', 'Reciclaje de vidrio y cristal', 'glass-water', '#9c27b0'),
('Electrónicos', 'Reciclaje de dispositivos electrónicos', 'smartphone', '#f44336'),
('Orgánicos', 'Compostaje y residuos orgánicos', 'leaf', '#8bc34a');

-- Sample Quizzes
INSERT INTO quizzes (title, description, category, difficulty, imageUrl, isActive) VALUES
('Fundamentos del Reciclaje', 'Aprende los conceptos básicos del reciclaje', 'Reciclaje Básico', 'easy', '/images/recycling-basics.jpg', true),
('Clasificación de Plásticos', 'Identifica los diferentes tipos de plásticos', 'Plásticos', 'medium', '/images/plastic-types.jpg', true),
('Reciclaje de Papel', 'Todo sobre el reciclaje de papel y cartón', 'Papel y Cartón', 'easy', '/images/paper-recycling.jpg', true),
('Residuos Electrónicos', 'Manejo responsable de e-waste', 'Electrónicos', 'hard', '/images/e-waste.jpg', true);

-- Sample Questions for "Fundamentos del Reciclaje" quiz
INSERT INTO questions (quizId, question, options, correct, points, order) VALUES
('quiz1_id', '¿Cuál es el símbolo universal del reciclaje?', 
 '["Tres flechas en círculo", "Una hoja verde", "Un contenedor azul", "Una botella"]', 
 0, 10, 1),
('quiz1_id', '¿Qué significa la regla de las 3 R?', 
 '["Reducir, Reutilizar, Reciclar", "Recoger, Revisar, Reparar", "Renovar, Restaurar, Reconstruir", "Ninguna de las anteriores"]', 
 0, 10, 2),
('quiz1_id', '¿Cuál de estos materiales NO es reciclable?', 
 '["Papel", "Vidrio", "Pañales desechables", "Latas de aluminio"]', 
 2, 10, 3);

-- Sample Achievements
INSERT INTO achievements (userId, name, description, icon, unlockedAt) VALUES
('user1_id', 'Primer Paso', 'Completaste tu primer quiz', 'trophy', NOW()),
('user1_id', 'Reciclador Novato', 'Alcanzaste 100 puntos', 'star', NOW()),
('user1_id', 'Eco-Warrior', 'Completaste 5 quizzes', 'shield', NOW());
