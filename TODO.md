# TODO List for Header Conditional Links and Logout Functionality

- [ ] Add accountLogout function in controllers/accountController.js: Clear JWT cookie, flash success message, redirect to home.
- [ ] Add logout route in routes/accountRoute.js: router.get("/logout", accountController.accountLogout).
- [ ] Update views/partials/header.ejs: Use EJS conditionals to show "Welcome Basic" (link to /account/) and "Logout" when logged in; show "My Account" when logged out.
- [ ] Test: Login to verify header shows "Welcome Basic" and "Logout"; logout to verify header shows "My Account" and redirects to home.
