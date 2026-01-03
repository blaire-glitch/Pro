-- Update the checksum to match the actual file
UPDATE "_prisma_migrations" 
SET "checksum" = encode(sha256(pg_read_binary_file('/dev/null')::bytea), 'hex')
WHERE "migration_name" = '20260103210000_init';

-- Or simply delete and let Prisma recreate
DELETE FROM "_prisma_migrations" WHERE "migration_name" = '20260103210000_init';
