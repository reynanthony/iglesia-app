SELECT s.title AS session_title, s.reference, sr.title AS series_title
FROM bible_study_sessions s
JOIN bible_study_series sr ON sr.id = s.series_id
ORDER BY sr.order_index, s.order_index;
