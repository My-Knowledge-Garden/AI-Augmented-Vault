# Generate Manifest Script

This script generates a `manifest.json` file from the `AI-Augmented-Vault` folder.

## Requirements

- Node.js installed
- `gray-matter` package: `npm install gray-matter`

## Usage

1. Ensure Node.js is installed.
2. Install dependencies: `npm install gray-matter`
3. Run the script: `node generate-manifest.js`

The script will scan the `AI-Augmented-Vault` folder up to 4 levels deep, extract Front Matter from `.md` files that contain all required fields and have `public: true`, and generate `manifest.json` with an array of objects including the fields and `filePath`.