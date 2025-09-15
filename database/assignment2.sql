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

-- 5. Use an Inner Join to select the make and model fields from the inventory table
    -- and the classification name field from the classification table for inventory items
    -- that belong to the "Sport" category.

SELECT 
    inv_make,
    inv_model,
    classification_name
FROM 
    public.inventory
INNER JOIN 
    public.classification
    ON public.inventory.classification_id = public.classification.classification_id
WHERE
    classification_name = 'Sport'; 