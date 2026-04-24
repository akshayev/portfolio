-- Create portraits bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('portraits', 'portraits', true)
ON CONFLICT (id) DO NOTHING;

-- Set up RLS for portraits bucket
CREATE POLICY "Public profiles are viewable by everyone."
ON storage.objects FOR SELECT
USING ( bucket_id = 'portraits' );

CREATE POLICY "Users can upload their own portrait."
ON storage.objects FOR INSERT
WITH CHECK (
    bucket_id = 'portraits' AND
    auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can update their own portrait."
ON storage.objects FOR UPDATE
USING (
    bucket_id = 'portraits' AND
    auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own portrait."
ON storage.objects FOR DELETE
USING (
    bucket_id = 'portraits' AND
    auth.uid()::text = (storage.foldername(name))[1]
);
