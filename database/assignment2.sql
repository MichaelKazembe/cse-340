-- TASK ONE - Write SQL Statements

-- 1. Insert a new record to table 'account'

INSERT INTO public.account (
	account_firstname,
	account_lastname,
	account_email,
	account_password,
	account_type
 	)
VALUES (
	'Tony',
	'Stark',
	'tony@starkent.com',
	'Iam1ronM@n'
);

-- 2. Modify the Tony Stark record to change  account_type to 'Admin'

UPDATE 
    public.account
SET 
    account_type = 'Admin'
WHERE 
    account_id = 1;


-- 3. Delete the Tony Stark record from table 'account'

DELETE FROM 
    public.account
WHERE 
    account_id = 1;


-- 4. Modify the "GM Hummer" record to read "a huge interior" 
    -- rather than "small interiors" using a single query

UPDATE
  public.inventory
SET
  inv_description = REPLACE(inv_description, 'small interiors', 'a huge interior')
WHERE
  inv_id = 10;