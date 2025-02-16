# GymManagementSystem
Gym Management System Project. Firebase Authentication and Realtime Database. Home, Admin, Member, User, Signup, Login etc pages.

# Gym Management System

## Introduction
The **Gym Management System** is a web-based platform designed to automate and streamline the management of a gym. It includes features for membership management, attendance tracking, billing, and supplement store management.

## Features
- **Admin Dashboard:** Manage gym operations, view reports, and track financials.
- **Member Portal:** View membership details, attendance, and diet plans.
- **Payment Management:** Track fee payments and generate invoices.
- **Supplement Store:** Manage and purchase gym supplements.
- **Reports & Analytics:** Generate graphical reports on membership, attendance, and revenue.

## Technology Stack
- **Frontend:** HTML, CSS, JavaScript
- **Backend:** Firebase (Authentication & Firestore Database)

## Project Workflow
1. **User Authentication:**
   - Users (Admins & Members) register and log in using Firebase Authentication.
2. **Dashboard Access:**
   - Admins access the dashboard to manage members, track payments, and generate reports.
   - Members access their profile, workout plans, and payment details.
3. **Membership & Billing:**
   - Admins assign membership plans, generate bills, and track payments.
4. **Attendance Tracking:**
   - Admins mark attendance or integrate it with an automated system.
5. **Supplement Store:**
   - Users browse and purchase supplements, and admins manage inventory.
6. **Reports & Analytics:**
   - Generate graphical reports on various metrics like revenue, active members, and attendance trends.

## Installation & Execution
1. **Clone the Repository:**
   ```bash
   git clone <repository-url>
   ```
2. **Navigate to Project Folder:**
   ```bash
   cd GymManagementSystem
   ```
3. **Open in Browser:**
   - Open `index.html` in a web browser to run the project.
4. **Firebase Configuration:**
   - Update Firebase API keys in the configuration file.

## Contribution Guidelines
- Fork the repository.
- Create a new branch (`feature-branch`).
- Commit your changes and create a pull request.

## License
This project is open-source and available under the MIT License.
---------------------------------------------------------------------------------------------------------
For further inquiries, please contact [chaudharinehay2001@gmail.com].
---------------------------------------------------------------------------------------------------------

### Baisc Database Connection
1. Set Up Firebase:  
   - Go to the official [Firebase website](https://firebase.google.com/) and create an account.  
   - Click on Get Started, then select Create Project, enter the project name, and click Continue.  
   - Disable Analytics and proceed.  
   - On the project page, click the Web `</>` icon, enter the web app name, and click Register App.  

2. Use Script Tag:  
   - In the next step, select "Use a `<script>` tag" and copy the provided code snippet.  
   - Create a `.js` file in your Visual Studio Code project and paste the copied code there.  

3. Authentication Setup:  
   - Return to the Firebase console and click Continue to Console.  
   - Go to Authentication > Get Started, then enable the Email/Password option and click Save.  

4. Domain Authorization:  
   - Run your project using the Live Server in Visual Studio Code.  
   - Copy the `127.0.0.1` URL and go to Firebase Project Settings > Authorized Domains.  
   - Click Add Domain, paste the URL in the input field, and remove everything except `127.0.0.1`.


### Setting Up Firebase Realtime Database  

1. Select Realtime Database in Firebase:  
   - Open the Firebase website and go to the sidebar.  
   - Under Product Categories, select Build > Realtime Database.  
   - Click on Create Database.  

2. Configure Database Settings:  
   - Ensure the language is set to English, then click Next.  
   - In the Security Rules section, select Test Mode and click Enable.  

3. Obtain Firebase Configuration Code:  
   - In the Firebase sidebar, click on the Gear Icon next to Project Overview.  
   - Select Project Settings.  
   - Copy the CDN Code provided.  
   - Paste this code in the needed `dashboard.html` file, just before the closing `</body>` tag.  

4. Implement CRUD Operations (Add, Retrieve, Update, Delete):  
   - Write JavaScript code to perform CRUD (Create, Read, Update, Delete) operations on the Realtime Database.  
   - Import the Firebase Database SDK, as it is essential for database operations.  

5. Data Storage in Realtime Database:  
   - The stored data will be visible in the Realtime Database under the Data section.  
   - Firebase will create a folder using the name you specify (e.g., `users/`, `purchase/`, `nofitications/` etc), and all stored data will be saved inside this folder.  
---------------------------------------------------------------------------------------------------------

### Displaying Firebase Data in Table Format on a Web Page

1. Copy Firebase Web App Config Code:  
   - Go to Firebase Project Settings.  
   - In the Web App Config section, copy the provided configuration code.  
   - Paste this code inside needed `dashboard.html`, just before the closing `</body>` tag.  

2. Write JavaScript to Display Data in Table Format:  
   - Use JavaScript to fetch data from Firebase and display it in a table format on the webpage.  
   - Ensure the Firebase Database SDK is properly imported.  

3. Run the Code and Verify Output:  
   - Once the code runs successfully, the data from Firebase will be displayed on the webpage in a structured table format.  
