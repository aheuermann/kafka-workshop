CREATE EXTENSION "uuid-ossp";
CREATE TABLE public.order_status (
    id UUID PRIMARY KEY,
    status TEXT NOT NULL,
    account_id TEXT NOT NULL,
    timestamp timestamp NOT NULL,
    created_at timestamp NOT NULL DEFAULT NOW(),
    updated_at timestamp NOT NULL DEFAULT NOW()
);