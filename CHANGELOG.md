# [1.14.0](https://github.com/ntuan2502/nextjs-amata/compare/v1.13.2...v1.14.0) (2025-05-28)


### Features

* enhance asset management with new fields for operating system and end of life ([82e85df](https://github.com/ntuan2502/nextjs-amata/commit/82e85df93e1ebe40bc4a2417236064d6675f2c95))

## [1.13.2](https://github.com/ntuan2502/nextjs-amata/compare/v1.13.1...v1.13.2) (2025-05-28)


### Bug Fixes

* **assets:** update office field to use shortName instead of name ([ad62228](https://github.com/ntuan2502/nextjs-amata/commit/ad62228b8790a605e82b47fb36a553ebe7f54e9e))

## [1.13.1](https://github.com/ntuan2502/nextjs-amata/compare/v1.13.0...v1.13.1) (2025-05-28)


### Bug Fixes

* **auth:** set cookie expiration for user and tokens to 7 days ([3c54a4d](https://github.com/ntuan2502/nextjs-amata/commit/3c54a4dd04e3312d1cb8ee7bac507ed0f3ae0234))

# [1.13.0](https://github.com/ntuan2502/nextjs-amata/compare/v1.12.0...v1.13.0) (2025-05-27)


### Features

* **admin:** add reusable search functionality across admin pages ([f164b19](https://github.com/ntuan2502/nextjs-amata/commit/f164b1911345aa3d191e425f8bb8a9251cecc172))

# [1.12.0](https://github.com/ntuan2502/nextjs-amata/compare/v1.11.0...v1.12.0) (2025-05-26)


### Features

* **assets:** add office, user, and department information to asset transactions ([ba3b69b](https://github.com/ntuan2502/nextjs-amata/commit/ba3b69b33d04c38c87e3301f0943bf456f1e581c))

# [1.11.0](https://github.com/ntuan2502/nextjs-amata/compare/v1.10.1...v1.11.0) (2025-05-23)


### Features

* **assets:** enhance asset details by adding office, user, and department information ([bda5bed](https://github.com/ntuan2502/nextjs-amata/commit/bda5bedba93866e13edb13e9d23ac95f7b2bf6ed))

## [1.10.1](https://github.com/ntuan2502/nextjs-amata/compare/v1.10.0...v1.10.1) (2025-05-23)


### Bug Fixes

* **auth:** correct Microsoft login URL to use API_URL from ENV ([7d6eb5f](https://github.com/ntuan2502/nextjs-amata/commit/7d6eb5fea2546bbc4a288ebd01e5bae731db5bbf))

# [1.10.0](https://github.com/ntuan2502/nextjs-amata/compare/v1.9.0...v1.10.0) (2025-05-23)


### Features

* **auth:** update Microsoft login URL to use environment variable ([40abed7](https://github.com/ntuan2502/nextjs-amata/commit/40abed77d6f7c8c605031803d3ad95011e789e3d))

# [1.9.0](https://github.com/ntuan2502/nextjs-amata/compare/v1.8.0...v1.9.0) (2025-05-23)


### Features

* add confirm request asset component and signature functionality ([d76b805](https://github.com/ntuan2502/nextjs-amata/commit/d76b8054b2f9171354a9b8a7b2bf3ec9f3fd1e05))
* add transaction type handling in asset request and confirmation components ([78c56ae](https://github.com/ntuan2502/nextjs-amata/commit/78c56ae16e6e94902f4ea895238f12f99d1d7e56))
* **auth:** implement Microsoft login functionality and update user context ([89ee865](https://github.com/ntuan2502/nextjs-amata/commit/89ee8657c27b466368c7e91293aa58aacf83082b))

# [1.8.0](https://github.com/ntuan2502/nextjs-amata/compare/v1.7.0...v1.8.0) (2025-05-09)


### Bug Fixes

* **admin:** correct gender field update in EditUserAdminComponent ([efb6220](https://github.com/ntuan2502/nextjs-amata/commit/efb6220043a7477075584bbdaa774822c75643ad))


### Features

* **asset:** add asset management functionality with Excel export and translations ([b4f199f](https://github.com/ntuan2502/nextjs-amata/commit/b4f199f858b17feb8210adfa633f26259fb4745d))
* **dashboard:** add admin dashboard with Recharts visualizations and loading states ([1e45d75](https://github.com/ntuan2502/nextjs-amata/commit/1e45d75aa0106dbc3a3d426315cf5d7525cffae7))

# [1.7.0](https://github.com/ntuan2502/nextjs-amata/compare/v1.6.0...v1.7.0) (2025-05-08)


### Features

* **admin:** add user and office management components with UI and translation support ([5cfb3a2](https://github.com/ntuan2502/nextjs-amata/commit/5cfb3a2008846a46c8c380072abc889dfb5806d3))

# [1.6.0](https://github.com/ntuan2502/nextjs-amata/compare/v1.5.0...v1.6.0) (2025-04-25)


### Features

* **profile:** add department field to profile and update translations ([7151b09](https://github.com/ntuan2502/nextjs-amata/commit/7151b09b9a509bfa393a397d05d8cf7914675436))
* **profile:** enhance profile management with new fields and i18n support ([c707b6e](https://github.com/ntuan2502/nextjs-amata/commit/c707b6eb85086dda5dfe8b1122ca811c3208c9b1))

# [1.5.0](https://github.com/ntuan2502/nextjs-amata/compare/v1.4.0...v1.5.0) (2025-04-24)


### Features

* **auth:** enhance user context management with sync and update functionality ([e40cfdb](https://github.com/ntuan2502/nextjs-amata/commit/e40cfdb41c311cacfc49ab4a7d49d4d33a06997c))
* **auth:** refactor login and logout functions for improved error handling and success feedback ([0c8c6fa](https://github.com/ntuan2502/nextjs-amata/commit/0c8c6fa97520d65fabc1cd5e5788b92a729a3971))
* **change-password:** implement change password functionality with validation and feedback ([ff97cdd](https://github.com/ntuan2502/nextjs-amata/commit/ff97cdd117782c5f2753f1538aa6b22b462d2ba7))
* **profile:** implement profile fetching and update functionality with error handling ([f3e0b49](https://github.com/ntuan2502/nextjs-amata/commit/f3e0b49be9b1fc68bbad41d2f82b27ebb22e3cb0))
* **sessions:** display user agent in session details ([d09b7a7](https://github.com/ntuan2502/nextjs-amata/commit/d09b7a771493d6279155273a5a9890a1abee31d2))

# [1.4.0](https://github.com/ntuan2502/nextjs-amata/compare/v1.3.0...v1.4.0) (2025-04-23)


### Features

* **sessions:** add logout functionality and improve session fetching logic ([f181c7e](https://github.com/ntuan2502/nextjs-amata/commit/f181c7eba53fd3ea9a10c36e12e4796a2703335b))

# [1.3.0](https://github.com/ntuan2502/nextjs-amata/compare/v1.2.0...v1.3.0) (2025-04-22)


### Features

* **account:** implement profile and sessions management with translations and session handling ([fbd9a33](https://github.com/ntuan2502/nextjs-amata/commit/fbd9a339c2f12a9bcff0e4a0770cf7afc39375fd))

# [1.2.0](https://github.com/ntuan2502/nextjs-amata/compare/v1.1.0...v1.2.0) (2025-04-19)


### Features

* **account:** add account management pages and translations ([99242a7](https://github.com/ntuan2502/nextjs-amata/commit/99242a7f15d6e0cf479637cf96aeede06c1f02cc))
* **auth:** implement user authentication flow with forgot, register, and reset password components ([c076ab2](https://github.com/ntuan2502/nextjs-amata/commit/c076ab212db6515768c7532089419e14fa6b8e13))

# [1.1.0](https://github.com/ntuan2502/nextjs-amata/compare/v1.0.0...v1.1.0) (2025-04-16)


### Features

* **auth:** implement authentication context and login functionality ([2e66f5c](https://github.com/ntuan2502/nextjs-amata/commit/2e66f5cd45447a9dd732b29b81846536173b0efd))

# 1.0.0 (2025-04-15)


### Bug Fixes

* **workflows:** update Node.js version to 22 and improve checkout step naming ([42f6d49](https://github.com/ntuan2502/nextjs-amata/commit/42f6d490f48187a39aeb4195f86581b3ec1bf319))


### Features

* **auth:** add AuthSocialLogin component for social authentication options ([ad2033b](https://github.com/ntuan2502/nextjs-amata/commit/ad2033bcd21df66a28f0ec64e03d06ecdbe6bca5))
* **auth:** add login page and install @iconify/react ([e354fcf](https://github.com/ntuan2502/nextjs-amata/commit/e354fcf31988d9df6e014848458cb17c8518a600))
* **auth:** add register page to auth route ([7e7bc09](https://github.com/ntuan2502/nextjs-amata/commit/7e7bc098bfb6c35faee5c8a96da01e371b531bfd))
* **auth:** enhance ForgotPassword and ResetPassword pages with translation support ([a9848fe](https://github.com/ntuan2502/nextjs-amata/commit/a9848fea97ba50fd9e55178ad32b23fe7a99def3))
* **auth:** implement ForgotPassword and ResetPassword pages with form validation ([cb05b82](https://github.com/ntuan2502/nextjs-amata/commit/cb05b82037c75f0f6917e2b4b7101e5ae41e59fc))
* **auth:** implement useFormField hook for form handling and validation ([d5d6293](https://github.com/ntuan2502/nextjs-amata/commit/d5d62933660adc694ba932371f14a99021dbb895))
* **auth:** update registration page content for clarity and engagement ([9db679b](https://github.com/ntuan2502/nextjs-amata/commit/9db679ba0593b83e5503a4f082d819fa621e40f6))
* **i18n:** add translation support for pause and reset actions in scan page ([bf12e0d](https://github.com/ntuan2502/nextjs-amata/commit/bf12e0d2926a062b7b7949336bc6f18da97468d8))
* **i18n:** integrate next-intl and localize authentication flow ([d681242](https://github.com/ntuan2502/nextjs-amata/commit/d6812422cad0905a66c0dee3a15e631997730d41))
* **i18n:** reorder cta section in localization files for consistency ([0aa2451](https://github.com/ntuan2502/nextjs-amata/commit/0aa24512c29910c0025a5403c5dcdeaa2f3e0d40))
* **layout:** add footer component to application ([fcf2708](https://github.com/ntuan2502/nextjs-amata/commit/fcf2708490846670a9c09c96ad7323b2e1fd38e4))
* **login:** use react-toastify and refactor form validation ([163eb4e](https://github.com/ntuan2502/nextjs-amata/commit/163eb4ec326d041e00b0a3e2b8364bff05f7c244))
* **register:** add react-toastify and restructure validation logic ([c8b3f40](https://github.com/ntuan2502/nextjs-amata/commit/c8b3f40290f1dafd534494d713b0c4a3fbfb24d9))
* **routes:** add centralized route definitions for cleaner and maintainable navigation ([f44db45](https://github.com/ntuan2502/nextjs-amata/commit/f44db456e4737e13aa949d5960517472750f9d53))
* **scan:** add QR scanner page and integrate with navbar for navigation ([acb9259](https://github.com/ntuan2502/nextjs-amata/commit/acb9259b729f16db23a398d4119d89fbd7f9ec89))
* **theme:** add ThemeSwitcher component and integrate next-themes for theme management ([c9c1e97](https://github.com/ntuan2502/nextjs-amata/commit/c9c1e970c05fc6a9bf90f3d3b1ba4c9f37a4b17d))
* **ui:** add responsive navbar and refactor icon system ([8dc2f8f](https://github.com/ntuan2502/nextjs-amata/commit/8dc2f8f6339a87b38254eb08c1445a75195ecce6))
