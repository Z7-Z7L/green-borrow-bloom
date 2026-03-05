
CREATE OR REPLACE FUNCTION public.get_most_borrowed_books(limit_count integer default 5)
RETURNS TABLE(book_id text, borrow_count bigint)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT book_id, COUNT(*) as borrow_count
  FROM public.borrowings
  GROUP BY book_id
  ORDER BY borrow_count DESC
  LIMIT limit_count;
$$;
