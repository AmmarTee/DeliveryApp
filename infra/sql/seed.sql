INSERT INTO users (id, phone, name) VALUES
  ('00000000-0000-0000-0000-000000000001', '923001112223', 'Admin');

INSERT INTO merchants (id, name, rating) VALUES
  ('00000000-0000-0000-0000-000000000010', 'Sample Merchant', 5);

INSERT INTO grocery_lists (id, user_id, raw_text) VALUES
  ('00000000-0000-0000-0000-000000000100', '00000000-0000-0000-0000-000000000001', '1kg atta');

INSERT INTO quotes (id, list_id, merchant_id, total, status) VALUES
  (
    '00000000-0000-0000-0000-000000001000',
    '00000000-0000-0000-0000-000000000100',
    '00000000-0000-0000-0000-000000000010',
    500,
    'submitted'
  );
