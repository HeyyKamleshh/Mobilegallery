# 📸 Image Gallery App (React Native + Flickr API)

A mobile image gallery app built using **React Native** and the **Flickr API**, enhanced with **Drawer and Bottom Tab Navigation**, along with a fully editable **User Profile** section. The app supports recent image browsing, keyword-based search, offline caching, favorites, and recent search history — all wrapped in a clean UI with smooth navigation.

---

## ✨ Features

- 🖼️ **Home Screen**: Displays recent images from Flickr with pagination.
- 🔍 **Search Functionality**: Search for images using keywords.
- 📁 **Recent Search History**: Shows last 5 unique search queries as clickable tags.
- ❤️ **Favorites**: Mark/unmark images as favorite and view them on a dedicated Favorites screen.
- 🔃 **Offline Support**: Caches recent images using AsyncStorage for offline viewing.
- 🧭 **Drawer + Bottom Tab Navigation**: Both navigators are integrated and fully in sync.
- 👤 **User Profile**:
  - Users can enter and edit their name, email, and bio.
  - Details are stored using AsyncStorage and persist across sessions.
- ✅ **Fully Responsive**: Works seamlessly on both Android and iOS using Expo.

---

## 🗂️ Folder Structure

```
/ImageGalleryApp
│
├── /assets                 
├── /components              
├── /navigation              # Drawer and Bottom Tab Navigation setup
├── /screens                 # HomeScreen, SearchScreen, FavoritesScreen, ProfileScreen
├── App.js                   
├── app.json                
├── package.json            
└── README.md               
```

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/HeyyKamleshh/Mobilegallery.git
cd Mobilegallery
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start the development server

```bash
npx expo start
```

> 📱 Use the **Expo Go** app on your phone to scan the QR code and run the app  
> 🧪 Or type `w` in the terminal to open in your browser

---

## 🔧 Tech Stack

- **React Native**
- **Expo**
- **Flickr API** (REST)
- **AsyncStorage**
- **Axios**
- **React Navigation (Drawer & Tabs)**
- **react-native-vector-icons**

---

## 📱 Screenshots

### 🏠 Home Page
![image](https://github.com/user-attachments/assets/29e2f562-ba85-495b-a3f0-504523ecfcfc)

### 🔍 Search Page
![image](https://github.com/user-attachments/assets/4519d466-68f1-4528-8323-37542e1ae362)

### ❤️ Favorites Page
![image](https://github.com/user-attachments/assets/a80b6052-b369-41df-8889-d752be593013)

### 👤 Profile Page
![image](https://github.com/user-attachments/assets/1e5fe34c-db26-421b-930d-4b6bea4f33a9)
)

---

> Built with ❤️ by **Kamlesh Bera**
