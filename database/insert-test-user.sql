-- Create roles first
INSERT INTO role (name, description) 
SELECT 'ROLE_USER', 'User role'
WHERE NOT EXISTS (SELECT 1 FROM role WHERE name = 'ROLE_USER');

INSERT INTO role (name, description) 
SELECT 'ROLE_ADMIN', 'Admin role'
WHERE NOT EXISTS (SELECT 1 FROM role WHERE name = 'ROLE_ADMIN');

-- Create test user (password: 123456 -> bcrypt)
INSERT INTO "user" (username, password, email, full_name, phone, status, created_at)
SELECT 
  '23810310082',
  '$2a$10$KKN6xvdm4zFNNOsVz.Yp8uLqWIqF.L7Yt5lm7DYU4ILI3h5h5K60i',
  'user.23810310082@system.local',
  'Test User',
  '0123456789',
  'ACTIVE'::text,
  NOW()
WHERE NOT EXISTS (SELECT 1 FROM "user" WHERE username = '23810310082');

-- Assign role to user
INSERT INTO user_role (user_id, role_id)
SELECT u.id, r.id
FROM "user" u, role r
WHERE u.username = '23810310082' 
  AND r.name = 'ROLE_USER'
  AND NOT EXISTS (
    SELECT 1 FROM user_role ur 
    WHERE ur.user_id = u.id AND ur.role_id = r.id
  );
