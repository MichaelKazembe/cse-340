-- TASK ONE - Write SQL Statements

-- Insert a new record to table 'account'

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
	'Iam1ronM@n',
	'Admin'
);

-- Delete the Tony Stark record from table 'account'

DELETE FROM public.account
WHERE account_firstname = 'Tony' AND account_lastname = 'Stark';


-- Modify the "GM Hummer" record to read "a huge interior" 
-- rather than "small interiors" using a single query

UPDATE
  public.inventory
SET
  inv_description = REPLACE(inv_description, 'small interiors', 'a huge interior')
WHERE
  inv_id = 10;