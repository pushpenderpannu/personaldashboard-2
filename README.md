# "Nexus" - The AI-Powered Command Center

Nexus is a hyper-personalized, AI-powered command center designed to be your one-stop dashboard for personal and professional data streams. It features a dense, multi-column grid layout that is fully customizable through dragging and resizing widgets.

At its core, Nexus integrates with Google's Gemini AI, allowing you to tune the AI's behavior for each widget directly from the UI, empowering you to create a truly personal and intelligent experience.

## Features

- **Draggable & Resizable Grid**: A dense, 84-column grid powered by `react-grid-layout` lets you organize your dashboard exactly how you want it. Your layout is automatically saved to local storage.
- **Tunable AI Prompts**: Each widget that uses AI has a customizable prompt. You can change how the AI summarizes news, provides weather insights, or sends stock alerts via the global Settings panel.
- **Real-time Notifications**: Get real-time browser notifications for important events, like stock price movements.
- **Containerized Deployment**: The entire application is containerized with Docker, allowing for a simple, one-command local deployment.
- **Persistent Configuration**: User-specific settings, like widget configurations, are saved in a persistent Docker volume, so your customizations are safe across container restarts.
- **Modular Widget Architecture**: Easily extend the dashboard by adding new widgets that fetch data from any API.

## Tech Stack

- **Frontend**: React, Material-UI (MUI) v5, React Grid Layout
- **Backend**: Node.js, Express.js
- **AI Engine**: Google Gemini
- **Deployment**: Docker, Docker Compose

## Getting Started

Getting your own instance of Nexus up and running is simple, thanks to Docker.

**Prerequisites**:
- [Docker](https://www.docker.com/get-started) must be installed and running on your system.

### 1. Clone the Repository

```bash
git clone <repository-url>
cd nexus-dashboard
```

### 2. Configure API Keys

The application requires an API key for Google Gemini.

- Create a file named `.env` in the root of the project directory.
- Copy the contents of `.env.example` into your new `.env` file.
- Add your Google Gemini API key to the `.env` file.
- **Important**: If you get an error message in the logs about a model not being found, you may need to specify a different model name. You can do this by setting the `GEMINI_MODEL_NAME` variable. Find available models for your key in Google AI Studio.

```env
# .env
GEMINI_API_KEY=YOUR_GEMINI_API_KEY_HERE
GEMINI_MODEL_NAME=gemini-1.5-flash-latest # Or another model available to you
```

### 3. Run with Docker Compose

Run the following command from the root of the project directory:

```bash
docker-compose up -d
```

This command will:
1.  Build the Docker image using the multi-stage `Dockerfile`.
2.  Start the `nexus-app` container in detached mode.
3.  Mount a volume to persist your `config.json`.

Your Nexus dashboard will be available at `http://localhost:3001`.

## Configuration & Updates

### API Keys and Environment

All required API keys are managed in the `.env` file. If you need to change a key, simply edit the `.env` file and restart the container:

```bash
docker-compose down
docker-compose up -d
```

### Widget Configuration (`config.json`)

The configuration for widgets (e.g., stock symbols, news topics, AI prompts) is managed through the application's UI via the **Settings** (gear) icon.

This configuration is stored in a Docker volume and persists automatically. You do not need to manually edit any files to configure the widgets. If you ever need to reset the configuration to its default state, you can stop the container, remove the Docker volume, and restart it:

```bash
docker-compose down
docker volume rm nexus-dashboard_nexus_data
docker-compose up -d
```

### Updating the Application

To update to the latest version of the application:

1.  Pull the latest changes from the repository:
    ```bash
    git pull origin main
    ```

2.  Rebuild the Docker image and restart the container:
    ```bash
    docker-compose up -d --build
    ```

This will build a new image with the latest code while keeping your `config.json` data intact.
