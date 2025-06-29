# MinimalChat

A lightweight real-time chat application built with Node.js, Express, Socket.IO, and MongoDB Atlas.

## Features

- Real-time messaging
- MongoDB Atlas integration
- Message timestamps
- Clean, minimal UI
- Single chatroom

## Tech Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Backend**: Node.js, Express.js, Socket.IO
- **Database**: MongoDB Atlas

## Environment Variables

- `MONGODB_URI`: MongoDB Atlas connection string
- `PORT`: Server port (optional, defaults to 3001)

## Local Development

```bash
npm install
npm run dev
```

## Production

```bash
npm install
npm start
```
```

### **Step 3: Railway Deployment Steps**

#### **3.1: Create Railway Account**
1. Go to [railway.app](https://railway.app)
2. Click "Start a New Project"
3. Sign up with your GitHub account

#### **3.2: Connect Your Repository**
1. Click "Deploy from GitHub repo"
2. Select your chat repository
3. Railway will automatically detect it's a Node.js project

#### **3.3: Set Environment Variables**
1. Go to your project dashboard
2. Click on the "Variables" tab
3. Add these environment variables:

| Variable Name | Value |
|---------------|-------|
| `MONGODB_URI` | `mongodb+srv://Aravind:Aravind%402041@cluster0.ykz5b.mongodb.net/chatapp` |
| `PORT` | `3001` (optional) |

#### **3.4: Deploy**
1. Railway will automatically start building and deploying
2. Wait for the build to complete (usually 2-3 minutes)
3. Your app will be live at the provided URL

### **Step 4: Update Your Code for Production**

Let's also make sure your server.js handles Railway's port assignment properly:

```javascript
// Update the PORT line in your server.js
const PORT = process.env.PORT || 3001;
```

### **Step 5: Test Your Deployment**

1. **Check the deployment logs** in Railway dashboard
2. **Visit your live URL** (something like `https://your-app-name.railway.app`)
3. **Test the chat functionality** by opening multiple browser tabs
4. **Verify MongoDB connection** by sending a message

### **Step 6: Custom Domain (Optional)**

1. Go to "Settings" tab in Railway
2. Click "Custom Domains"
3. Add your domain if you have one

---

## 🎯 **What Happens During Deployment**

1. **Railway detects** your Node.js project
2. **Installs dependencies** from `package.json`
3. **Runs the start script** (`node server.js`)
4. **Sets up environment variables**
5. **Deploys to Railway's infrastructure**
6. **Provides a live URL**

---

## ✅ **Advantages of Railway for Your Chat App**

- ✅ **Full WebSocket support** - No limitations like Vercel
- ✅ **Persistent connections** - Perfect for real-time chat
- ✅ **MongoDB Atlas integration** - Works seamlessly
- ✅ **Auto-scaling** - Handles multiple users
- ✅ **Free tier** - Generous limits for development
- ✅ **Easy deployment** - GitHub integration

---

## 🚨 **Common Issues & Solutions**

**Issue**: "Build failed"
- **Solution**: Check that `package.json` has correct `start` script

**Issue**: "MongoDB connection failed"
- **Solution**: Verify `MONGODB_URI` environment variable is set correctly

**Issue**: "Socket.IO not working"
- **Solution**: Railway supports WebSockets, but check CORS settings

---

**Ready to deploy?** Follow the steps above and let me know if you encounter any issues during the process!