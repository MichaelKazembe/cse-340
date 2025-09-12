-- Type: account_type

CREATE TYPE public.account_type AS ENUM
    ('Client', 'Employee', 'Admin');

ALTER TYPE public.account_type
    OWNER TO cse340;