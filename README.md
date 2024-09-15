# Radio Globe App

This is a Next.js application that allows users to explore and listen to online radios from around the world. The app uses a 3D globe (Resium/Cesium) to display radio stations that can be selected interactively. Users can also choose a station randomly. The app integrates the Radio Browser API to fetch the available stations.

## Features

- **Globe Interface**: A 3D globe powered by Resium/Cesium to display radio stations visually on a map.
- **Radio Player**: Choose and play radio stations from the globe or randomly.
- **Station Search**: Find specific radio stations from the Radio Browser API.
- **Responsive UI**: Tailwind CSS and Headless UI ensure a smooth, responsive design.

## Tech Stack

- **Next.js**: React framework for server-side rendering and API routes.
- **Resium & Cesium**: For rendering the interactive 3D globe.
- **Zustand**: State management for managing global state in the app.
- **Tailwind CSS**: Utility-first CSS framework for styling.
- **Headless UI**: Unstyled, accessible UI components to build a customized user interface.
- **Radio Browser API**: Provides a list of online radio stations.

## Getting Started

### Prerequisites

Ensure you have the following installed on your local development environment:

- Node.js v14 or higher
- npm or yarn

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/Raphaelmoi/world-radio.git
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables by creating a `.env` file in the root of your project and adding your necessary API keys (if any).
4. Get a Cesium token and replace the NEXT_PUBLIC_CESIUM_ION_TOKEN value

### Development

To start the development server, run:

```bash
npm run dev
```

This will start the Next.js development server on `http://localhost:3000`.

### Building for Production

To build the app for production, use:

```bash
npm run build
```

### Running in Production

After building the app, you can run it in production mode with:

```bash
npm run start
```

### API Integration

This app uses the [Radio Browser API](https://www.radio-browser.info/) to fetch online radio stations. The stations are displayed on the globe and can be searched or played directly.

### Zustand State Management

Zustand is used for managing the global state of the application.

### Tailwind & Headless UI

Tailwind CSS is used for styling the components, ensuring a mobile-first responsive design. Headless UI is leveraged for accessible, unstyled UI components such as modals and dropdowns.

### Contributions

Feel free to fork the repository and create a pull request. Contributions are welcome!

## License

This project is licensed under the MIT License.