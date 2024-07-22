# Social Media Post Generator

This project uses Next.js, Google Generative AI, and Google Sheets API to generate and store social media posts based on user prompts.

## Folder Structure and Code Walkthrough

### Root Directory

- **README.md**: This file, providing an overview of the project.
- **next.config.js**: Configuration file for Next.js.
- **package.json**: Lists project dependencies and scripts.
- **tsconfig.json**: TypeScript configuration file.
- **.env.local**: Environment variables for local development (ensure this file is added to `.gitignore`).

### `/app`

- **/app/api**
  - **/generate-post/route.ts**: Handles the API endpoint for generating social media posts using Google Generative AI and storing them in Google Sheets.
  - **/fetch-posts/route.ts**: Handles the API endpoint for fetching stored social media posts from Google Sheets.

- **/page.tsx**: Main frontend page component which allows users to input prompts, generate posts, and display previously generated posts.

### Detailed Code Walkthrough

#### `app/api/generate-post/route.ts`

- **Description**: This endpoint handles POST requests to generate a social media post based on user input and stores the generated post in a Google Spreadsheet.
- **Key Functions**:
  - Parses the user prompt from the request body.
  - Initializes the Google Generative AI client.
  - Generates content based on the user prompt.
  - Stores the generated post along with the prompt and timestamp in Google Sheets.

#### `app/api/fetch-posts/route.ts`

- **Description**: This endpoint handles GET requests to fetch all previously generated social media posts from a Google Spreadsheet.
- **Key Functions**:
  - Initializes the Google Sheets client.
  - Fetches the posts from the specified range in the spreadsheet.
  - Returns the posts in JSON format.

#### `app/page.tsx`

- **Description**: The main frontend component that provides the user interface.
- **Key Features**:
  - Input form for users to enter prompts.
  - Button to trigger post generation.
  - Displays the generated post.
  - Fetches and displays a list of previously generated posts from the backend.


### Running the Project

1. **Install Dependencies**: npm install

2. **Run the Development Server**: npm run dev


3. **Access the Application**:
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Note

- Ensure your Google Cloud project has the Sheets API enabled.
- The service account JSON file must have the necessary permissions to access and edit the specified Google Spreadsheet.

