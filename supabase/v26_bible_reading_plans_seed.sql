-- v26 seed: planes de lectura iniciales (generado por scripts/generate-reading-plan-seed.mjs)

-- Evangelio de Juan en 21 días (21 días)
WITH plan AS (
  INSERT INTO bible_reading_plans (title, slug, description, duration_days, category, order_index)
  VALUES ('Evangelio de Juan en 21 días', 'juan-21-dias', 'Recorre el Evangelio de Juan capítulo por capítulo, un día a la vez.', 21, 'evangelios', 1)
  RETURNING id
)
INSERT INTO bible_reading_plan_days (plan_id, day_number, book_id, chapter_start, chapter_end)
SELECT id, v.day_number, v.book_id, v.chapter_start, v.chapter_end FROM plan, (VALUES
  (1, 'JHN', 1, 1),
  (2, 'JHN', 2, 2),
  (3, 'JHN', 3, 3),
  (4, 'JHN', 4, 4),
  (5, 'JHN', 5, 5),
  (6, 'JHN', 6, 6),
  (7, 'JHN', 7, 7),
  (8, 'JHN', 8, 8),
  (9, 'JHN', 9, 9),
  (10, 'JHN', 10, 10),
  (11, 'JHN', 11, 11),
  (12, 'JHN', 12, 12),
  (13, 'JHN', 13, 13),
  (14, 'JHN', 14, 14),
  (15, 'JHN', 15, 15),
  (16, 'JHN', 16, 16),
  (17, 'JHN', 17, 17),
  (18, 'JHN', 18, 18),
  (19, 'JHN', 19, 19),
  (20, 'JHN', 20, 20),
  (21, 'JHN', 21, 21)
) AS v(day_number, book_id, chapter_start, chapter_end);

-- Génesis en 25 días (25 días)
WITH plan AS (
  INSERT INTO bible_reading_plans (title, slug, description, duration_days, category, order_index)
  VALUES ('Génesis en 25 días', 'genesis-25-dias', 'Los orígenes de todo: creación, pacto y las primeras familias de la fe.', 25, 'pentateuco', 2)
  RETURNING id
)
INSERT INTO bible_reading_plan_days (plan_id, day_number, book_id, chapter_start, chapter_end)
SELECT id, v.day_number, v.book_id, v.chapter_start, v.chapter_end FROM plan, (VALUES
  (1, 'GEN', 1, 2),
  (2, 'GEN', 3, 4),
  (3, 'GEN', 5, 6),
  (4, 'GEN', 7, 8),
  (5, 'GEN', 9, 10),
  (6, 'GEN', 11, 12),
  (7, 'GEN', 13, 14),
  (8, 'GEN', 15, 16),
  (9, 'GEN', 17, 18),
  (10, 'GEN', 19, 20),
  (11, 'GEN', 21, 22),
  (12, 'GEN', 23, 24),
  (13, 'GEN', 25, 26),
  (14, 'GEN', 27, 28),
  (15, 'GEN', 29, 30),
  (16, 'GEN', 31, 32),
  (17, 'GEN', 33, 34),
  (18, 'GEN', 35, 36),
  (19, 'GEN', 37, 38),
  (20, 'GEN', 39, 40),
  (21, 'GEN', 41, 42),
  (22, 'GEN', 43, 44),
  (23, 'GEN', 45, 46),
  (24, 'GEN', 47, 48),
  (25, 'GEN', 49, 50)
) AS v(day_number, book_id, chapter_start, chapter_end);

-- Salmos en 30 días (30 días)
WITH plan AS (
  INSERT INTO bible_reading_plans (title, slug, description, duration_days, category, order_index)
  VALUES ('Salmos en 30 días', 'salmos-30-dias', 'Un mes de oración, alabanza y consuelo a través del salterio completo.', 30, 'sabiduria', 3)
  RETURNING id
)
INSERT INTO bible_reading_plan_days (plan_id, day_number, book_id, chapter_start, chapter_end)
SELECT id, v.day_number, v.book_id, v.chapter_start, v.chapter_end FROM plan, (VALUES
  (1, 'PSA', 1, 5),
  (2, 'PSA', 6, 10),
  (3, 'PSA', 11, 15),
  (4, 'PSA', 16, 20),
  (5, 'PSA', 21, 25),
  (6, 'PSA', 26, 30),
  (7, 'PSA', 31, 35),
  (8, 'PSA', 36, 40),
  (9, 'PSA', 41, 45),
  (10, 'PSA', 46, 50),
  (11, 'PSA', 51, 55),
  (12, 'PSA', 56, 60),
  (13, 'PSA', 61, 65),
  (14, 'PSA', 66, 70),
  (15, 'PSA', 71, 75),
  (16, 'PSA', 76, 80),
  (17, 'PSA', 81, 85),
  (18, 'PSA', 86, 90),
  (19, 'PSA', 91, 95),
  (20, 'PSA', 96, 100),
  (21, 'PSA', 101, 105),
  (22, 'PSA', 106, 110),
  (23, 'PSA', 111, 115),
  (24, 'PSA', 116, 120),
  (25, 'PSA', 121, 125),
  (26, 'PSA', 126, 130),
  (27, 'PSA', 131, 135),
  (28, 'PSA', 136, 140),
  (29, 'PSA', 141, 145),
  (30, 'PSA', 146, 150)
) AS v(day_number, book_id, chapter_start, chapter_end);

-- Proverbios en 31 días (31 días)
WITH plan AS (
  INSERT INTO bible_reading_plans (title, slug, description, duration_days, category, order_index)
  VALUES ('Proverbios en 31 días', 'proverbios-31-dias', 'Un capítulo de sabiduría práctica por cada día del mes.', 31, 'sabiduria', 4)
  RETURNING id
)
INSERT INTO bible_reading_plan_days (plan_id, day_number, book_id, chapter_start, chapter_end)
SELECT id, v.day_number, v.book_id, v.chapter_start, v.chapter_end FROM plan, (VALUES
  (1, 'PRO', 1, 1),
  (2, 'PRO', 2, 2),
  (3, 'PRO', 3, 3),
  (4, 'PRO', 4, 4),
  (5, 'PRO', 5, 5),
  (6, 'PRO', 6, 6),
  (7, 'PRO', 7, 7),
  (8, 'PRO', 8, 8),
  (9, 'PRO', 9, 9),
  (10, 'PRO', 10, 10),
  (11, 'PRO', 11, 11),
  (12, 'PRO', 12, 12),
  (13, 'PRO', 13, 13),
  (14, 'PRO', 14, 14),
  (15, 'PRO', 15, 15),
  (16, 'PRO', 16, 16),
  (17, 'PRO', 17, 17),
  (18, 'PRO', 18, 18),
  (19, 'PRO', 19, 19),
  (20, 'PRO', 20, 20),
  (21, 'PRO', 21, 21),
  (22, 'PRO', 22, 22),
  (23, 'PRO', 23, 23),
  (24, 'PRO', 24, 24),
  (25, 'PRO', 25, 25),
  (26, 'PRO', 26, 26),
  (27, 'PRO', 27, 27),
  (28, 'PRO', 28, 28),
  (29, 'PRO', 29, 29),
  (30, 'PRO', 30, 30),
  (31, 'PRO', 31, 31)
) AS v(day_number, book_id, chapter_start, chapter_end);

-- El Nuevo Testamento (98 días)
WITH plan AS (
  INSERT INTO bible_reading_plans (title, slug, description, duration_days, category, order_index)
  VALUES ('El Nuevo Testamento', 'nuevo-testamento', 'De los Evangelios a Apocalipsis, en tramos breves y sostenibles cada día.', 98, 'nuevo-testamento', 5)
  RETURNING id
)
INSERT INTO bible_reading_plan_days (plan_id, day_number, book_id, chapter_start, chapter_end)
SELECT id, v.day_number, v.book_id, v.chapter_start, v.chapter_end FROM plan, (VALUES
  (1, 'MAT', 1, 3),
  (2, 'MAT', 4, 6),
  (3, 'MAT', 7, 9),
  (4, 'MAT', 10, 12),
  (5, 'MAT', 13, 15),
  (6, 'MAT', 16, 18),
  (7, 'MAT', 19, 21),
  (8, 'MAT', 22, 24),
  (9, 'MAT', 25, 27),
  (10, 'MAT', 28, 28),
  (11, 'MRK', 1, 3),
  (12, 'MRK', 4, 6),
  (13, 'MRK', 7, 9),
  (14, 'MRK', 10, 12),
  (15, 'MRK', 13, 15),
  (16, 'MRK', 16, 16),
  (17, 'LUK', 1, 3),
  (18, 'LUK', 4, 6),
  (19, 'LUK', 7, 9),
  (20, 'LUK', 10, 12),
  (21, 'LUK', 13, 15),
  (22, 'LUK', 16, 18),
  (23, 'LUK', 19, 21),
  (24, 'LUK', 22, 24),
  (25, 'JHN', 1, 3),
  (26, 'JHN', 4, 6),
  (27, 'JHN', 7, 9),
  (28, 'JHN', 10, 12),
  (29, 'JHN', 13, 15),
  (30, 'JHN', 16, 18),
  (31, 'JHN', 19, 21),
  (32, 'ACT', 1, 3),
  (33, 'ACT', 4, 6),
  (34, 'ACT', 7, 9),
  (35, 'ACT', 10, 12),
  (36, 'ACT', 13, 15),
  (37, 'ACT', 16, 18),
  (38, 'ACT', 19, 21),
  (39, 'ACT', 22, 24),
  (40, 'ACT', 25, 27),
  (41, 'ACT', 28, 28),
  (42, 'ROM', 1, 3),
  (43, 'ROM', 4, 6),
  (44, 'ROM', 7, 9),
  (45, 'ROM', 10, 12),
  (46, 'ROM', 13, 15),
  (47, 'ROM', 16, 16),
  (48, '1CO', 1, 3),
  (49, '1CO', 4, 6),
  (50, '1CO', 7, 9),
  (51, '1CO', 10, 12),
  (52, '1CO', 13, 15),
  (53, '1CO', 16, 16),
  (54, '2CO', 1, 3),
  (55, '2CO', 4, 6),
  (56, '2CO', 7, 9),
  (57, '2CO', 10, 12),
  (58, '2CO', 13, 13),
  (59, 'GAL', 1, 3),
  (60, 'GAL', 4, 6),
  (61, 'EPH', 1, 3),
  (62, 'EPH', 4, 6),
  (63, 'PHP', 1, 3),
  (64, 'PHP', 4, 4),
  (65, 'COL', 1, 3),
  (66, 'COL', 4, 4),
  (67, '1TH', 1, 3),
  (68, '1TH', 4, 5),
  (69, '2TH', 1, 3),
  (70, '1TI', 1, 3),
  (71, '1TI', 4, 6),
  (72, '2TI', 1, 3),
  (73, '2TI', 4, 4),
  (74, 'TIT', 1, 3),
  (75, 'PHM', 1, 1),
  (76, 'HEB', 1, 3),
  (77, 'HEB', 4, 6),
  (78, 'HEB', 7, 9),
  (79, 'HEB', 10, 12),
  (80, 'HEB', 13, 13),
  (81, 'JAS', 1, 3),
  (82, 'JAS', 4, 5),
  (83, '1PE', 1, 3),
  (84, '1PE', 4, 5),
  (85, '2PE', 1, 3),
  (86, '1JN', 1, 3),
  (87, '1JN', 4, 5),
  (88, '2JN', 1, 1),
  (89, '3JN', 1, 1),
  (90, 'JUD', 1, 1),
  (91, 'REV', 1, 3),
  (92, 'REV', 4, 6),
  (93, 'REV', 7, 9),
  (94, 'REV', 10, 12),
  (95, 'REV', 13, 15),
  (96, 'REV', 16, 18),
  (97, 'REV', 19, 21),
  (98, 'REV', 22, 22)
) AS v(day_number, book_id, chapter_start, chapter_end);

