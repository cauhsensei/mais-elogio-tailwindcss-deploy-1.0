export const USER_TYPES = {
    USER: 'user',
    COMPANY: 'company',
};

export const APP_ROUTES = {
    "USER_DASHBOARD": {
        path: '/user/dashboard',
        allowedUsers: [USER_TYPES.USER],
    },
    "COMPANY_DASHBOARD": {
        path: '/company/dashboard',
        allowedUsers: [USER_TYPES.COMPANY],
    },
    // ...
};

