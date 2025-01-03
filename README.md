# **GYMPRO - Gym Posture Analysis Mobile Application** 📱💪

**GYMPRO** is a mobile application designed to enhance workout safety and effectiveness by providing real-time feedback on posture. By using machine learning to prevent injuries and track progress, GYMPRO makes fitness accessible, motivating, and data-driven.

---

## **Table of Contents**
- [**About the Project**](#about-the-project)
- [**Features**](#features)
- [**Tech Stack**](#tech-stack)
- [**Getting Started**](#getting-started)
  - [**Prerequisites**](#prerequisites)
  - [**Installation**](#installation)
  - [**Usage**](#usage)
- [**Model Details**](#model-details)
- [**Data Collection and Processing**](#data-collection-and-processing)
- [**Project Structure**](#project-structure)
- [**Roadmap**](#roadmap)
- [**Contributing**](#contributing)
- [**License**](#license)
- [**Contact**](#contact)

---

## **About the Project**

The goal of GYMPRO is to provide users with instant feedback on their workout form. This app targets key exercises across major muscle groups, helping users improve form, stay safe, and track their progress.

---

## **Features**

- **Pose Analysis and Feedback**: Real-time form correction for exercises.
- **Workout Tracking**: Record performance, progress, and improvement.
- **Dashboard Visualization**: View workout statistics, including performance metrics.
- **User-friendly Interface**: Simple UI with clear feedback visuals.

---

## **Tech Stack**

- **Frontend**: React Native, JavaScript
- **Machine Learning**: MoveNet Lightning (SinglePose 256x256), TensorflowJS, TFLite
- **Backend**: REST API
- **Database**: MongoDB

---

## **Getting Started**

Follow these steps to set up the project on your local machine.

### **Prerequisites**

- [Node.js](https://nodejs.org/) (version 20.15.1)
- [React Native CLI](https://reactnative.dev/docs/environment-setup)
- MongoDB or MongoDB Atlas (for backend)

### **Installation**

1. **Install dependencies**
   ```bash
   cd gympro
   yarn install

2. **Run the application**
   ```bash
   yarn start
