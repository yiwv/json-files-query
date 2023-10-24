# Vue Image Drop Form

A simple Vue 3 component for image file selection, drag-and-drop, and preview functionality.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Props](#props)
- [Events](#events)
- [Running Tests](#running-tests)

## Installation

Install the package using npm:

```bash
npm install vue-image-drop-form
```

Or using yarn:

```bash
yarn add vue-image-drop-form
```

## Usage

Here is a simple example:

```javascript
import VueImageDropForm from 'vue-image-drop-form'

// In your Vue component
<VueImageDropForm label="Upload Image" @change="handleImageChange" />
```

## Props

- `label`: The label for the file input.

## Events

- `change`: Emitted when a file is selected or dropped. The selected `File` object is passed as an argument.

## Running Tests

To run tests, execute the following command:

```bash
npm run test
```
