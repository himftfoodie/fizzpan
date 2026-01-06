
# Restaurant Management App

This project is a web-based restaurant management system designed to streamline various aspects of restaurant operations, including table management, food ordering, user management, and order processing.  The system aims to enhance the overall dining experience for customers and improve operational efficiency for restaurant owners and staff.

## Challenges
The main challenge is to implement the functionalities like table management, user management, order management, routing, and Redux State management using React JS and other technologies.


## Key Features
1. User Authentication: The application provides user authentication functionality, allowing users to log in, and log out securely. It employs token-based authentication for protecting routes and ensuring secure access to sensitive information.

2. Dashboard: The dashboard provides an overview of various aspects of the business, such as user management, table management, food menu management, and order management. It offers a user-friendly interface for managing these operations efficiently.

3. User Management: The application allows administrators to manage user information, including adding new users, and removing users from the system. This feature facilitates efficient management of staff members.

4. Table Management: It enables administrators to manage restaurant tables, including adding new tables, updating table configurations, and marking tables as occupied or available. This feature helps in optimizing table allocation and improving the dining experience for customers.

5. Food Menu Management: Administrators can manage the food menu, including adding new food items,  and removing items from the menu. This functionality enables businesses to keep their menu offerings up-to-date and appealing to customers.

6. Order Management: The application facilitates order management, allowing staff to view and manage incoming orders efficiently. It provides features such as order status updates, and order history to streamline the order fulfillment process.

## Used Technologies
1. vite: 5.1.0
2. react: 18.2.0
3. react-redux: 9.1.0
4. reduxjs/toolkit: 2.2.1
5. mui/material: 5.15.10
6. axios: 1.6.7
7. tailwindcss: 3.4.1

## Used Utility
1. Primary Color: #cc080b
2. Secondary Color: #79a33d
3. Primary Font: Josefin Sans, sans-serif
4. Secondary Font: Quattrocento, serif;

## 🔗 Live Site Link
[![Live](https://img.shields.io/badge/Click_Here_For_Restaurant_APP-000?style=for-the-badge&logo=ko-fi&logoColor=white)](https://sparkly-longma-26edc6.netlify.app)



## Admin Login Credential

Username: admin@mail.com \
Password: Admin@123

## Project Setup

Install the App with npm

```bash
  npm install
```

Run the App with npm

```bash
  npm run dev
```

Build the App with npm

```bash
  npm run build
```
    
## Output for Desktop Mode

=> This is the login page. Admin can login using credential.

![loginPage](https://github.com/firose-munna/restauremt/assets/105736440/ee005fca-1f88-485d-af61-d19597b21ee5)


=> This is User List page. Here admin can see all kinds of information about an user. Admin can update all users information by clicking on edit button. Also, the users information can be deleted by clicking on the delete button.

![allUser](https://github.com/firose-munna/restauremt/assets/105736440/7e23ccb0-c45f-4b25-8a79-28829727498c)


=> This page is for add a new user. This page will open when admin click on the Add User button of the user list.

![addUser](https://github.com/firose-munna/restauremt/assets/105736440/ab7c9a9d-b8fa-42aa-9c55-555173896429)


=> Here is the validation check for add a new user. So all fields except middle name and image field must be filled.

![error](https://github.com/firose-munna/restauremt/assets/105736440/4d515c09-5181-4734-a444-3b2cfd4fdafa)


=> This is Table List page. Here admin can see all kinds of information about table. The tables information can be deleted by clicking on the delete button.

![AllTableList](https://github.com/firose-munna/restauremt/assets/105736440/fb87f6e3-97e8-434b-93a8-04f317abedcd)

=> This page is for add a new table. This page will open when admin click on the Add Table button of the table list.

![Add Table](https://github.com/firose-munna/restauremt/assets/105736440/4b0cfb5f-6c31-4671-a811-fee2c65987ee)

=> By clicking on the plus button of the Table List page will open this modal and admin can assign user to a table.

![asign](https://github.com/firose-munna/restauremt/assets/105736440/4965225d-144e-41a3-8256-112cc7768ca3)

=> By clicking on the cross button on the right side of the user chip, the assigned user from a table will be removed by confirmation of the alert.

![remove user](https://github.com/firose-munna/restauremt/assets/105736440/9377080a-e1f8-4ac3-8d40-7f5b76504919)

=> This is Food List page. Here admin can see all kinds of information about foods. Admin can update all foods information by clicking on edit button. Also, the foods information can be deleted by clicking on the delete button.

![AllFoodList](https://github.com/firose-munna/restauremt/assets/105736440/9ba87ac5-5e96-402e-860c-fc807b241a05)

=> This page is for add a new food. This page will open when admin click on the Add Food button of the food list.

![Addfood](https://github.com/firose-munna/restauremt/assets/105736440/68d37f38-0381-4544-9010-1e1e5185381e)

=> When no table is selected from the table list, the food list will be hidden and show a message "select a table first".

![orderFood1](https://github.com/firose-munna/restauremt/assets/105736440/e4e51925-3b28-4209-b513-d3edce6aa4bb)

=> After Select a Table user can select the food items and order.

![orderFood2](https://github.com/firose-munna/restauremt/assets/105736440/5bbf3801-26d5-44ae-aad4-4b89c41449e1)

=> This is the cart where user can modify the order items then place the order.

![orderCart](https://github.com/firose-munna/restauremt/assets/105736440/73897f9e-7f8c-4dfb-a15b-5bb5d9ed6c58)

=> This is Order List page. Here admin can see all kinds of information about order. The orders information can be deleted by clicking on the delete button also modify the order status by clicking edit button.

![Screenshot 2024-03-22 010550](https://github.com/firose-munna/restauremt/assets/105736440/1c808715-7ef1-45d1-a928-4898e07e71ba)



## Output for Mobile Mode

=> For mobile responsive, Drawer Menu will be open and close by clicking the hamburger icon. 

![drawer](https://github.com/firose-munna/restauremt/assets/105736440/94469896-048b-46a6-902d-caebebefe2a4)

=> The text will be ellipsis when this page shown in mobile.

![home](https://github.com/firose-munna/restauremt/assets/105736440/038f42ed-65cd-4e63-9143-66d1a483d68a)

=> For mobile responsive, Modal will resized as small. Also the modal contents will shown as column view.

![AssignUserToTable](https://github.com/firose-munna/restauremt/assets/105736440/fc1ab84e-4178-402e-9ac1-bbf2c185e3a6)

=> For mobile responsive, all the order list will shown as a column view.

![allOrderItemMobile](https://github.com/firose-munna/restauremt/assets/105736440/eb1bbdc4-06f7-4a11-b0ca-9a3f7b0a2c7e)

=> When user want to change the order status, by clicking the edit button from the Order List page user can change it.

![ChabgeOrderStatus](https://github.com/firose-munna/restauremt/assets/105736440/c9b96e70-2444-441e-8f7a-58ebacf2d491)


## Deployment

For Netlify Deployment Add The _redirects File Into Public Folder And Paste This-

```bash
  /*    /index.html   200
```

