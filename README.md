# 🎵 KMCAM - Owner Panel

**Kwaya ya Mtakatifu Carlo Acutis** - Owner Panel ni mfumo wa kusimamia content zote za app ya KMCAM. Inamruhusu Main Admin na Step Admins kusimamia users, cards, posts, notifications, media, na zaidi.

---

## 📋 **Features**

### 🔐 Authentication
- PIN Login (4 digits)
- PIN Recovery (kwa Jina au Phone)
- Session management (localStorage)

### 📱 PWA Features
- Install Prompt (baada ya login)
- Push Notifications
- Offline Support
- App Icon (192x192, 512x512)

### 📊 Dashboard
- Total Users, Posts, Downloads, Likes
- Storage Monitoring (Supabase, Cloudinary, UploadCare)
- Recent Activity
- Quick Actions

### 👥 Users Management
- View all users
- Search kwa jina, phone, parokia, jimbo
- Ban/Unban users
- Delete users
- View user details (points, stats)

### 🎴 Cards Management
- Watakatifu (Jina, Picha, Historia, Miujiza, Sala)
- Bible Verse (Kichwa, Rejea, Mstari, Funzo)
- Masomo ya Dominika (Somo 1, Wimbo, Somo 2, Shangilio, Injili)
- Wimbo wa Siku (Audio/Video, Description)
- Scheduling (Start Date, End Date)

### 📝 Posts Management
- Create Posts (Picha, Video, Text)
- Upload Media (Folder au URL)
- Pin Posts
- Draft/Published
- Delete Posts

### 🔔 Notifications
- Send kwa All Users au Specific User
- Scheduled Notifications
- View Sent Notifications

### 📜 History
- Daily content archive
- Watakatifu, Bible Verse, Masomo, Wimbo

### 🖼️ Media Library
- Grid View
- Filter (Images, Videos, Audio)
- Upload (Cloudinary kwa images/videos, UploadCare kwa audio)
- External URL support
- Delete Media

### 📊 Analytics
- Page Views (7/30/90 days)
- Engagement Charts
- User Growth

### 🗓️ Schedule
- Content Scheduling
- Recurrence (Daily, Weekly, Monthly)
- Cancel Scheduled Content

### 🎨 Appearance
- Theme Colors
- Intro Page Settings
- Logo Upload
- Watermark Settings

### ⚙️ Settings
- App Settings
- PWA Settings
- Notification Settings
- Storage Thresholds

### 🔑 Owners Management
- Add Step Admins
- Assign Permissions
- Promote Step Admin → Main Admin
- Delete Owners
- Role-based access

### 💾 SQL Editor
- Run SQL Queries (SELECT, INSERT, UPDATE, DELETE)
- Query History (localStorage)
- Saved Queries (localStorage)
- Common Queries
- Super Admin only

---

## 🚀 **Setup Instructions**

### Prerequisites
- Node.js 18+ au 20.x
- npm au yarn

### Installation

1. **Clone repository:**
```bash
git clone https://github.com/your-username/kmcam-owner-pro.git
cd kmcam-owner-pro