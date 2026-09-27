# Spare Inventory — Firebase + Vercel Setup

This folder has everything needed to host your inventory app on its own
address (no Claude wrapper), installable like a real app, with live
syncing across every phone/laptop that opens it.

There are two steps: (1) create a free Firebase project to hold the shared
data, (2) deploy this folder to Vercel. Takes about 10–15 minutes total.

---

## Step 1 — Create a free Firebase project (holds the shared data)

1. Go to https://console.firebase.google.com and sign in with a Google account.
2. Click **"Add project"**, give it any name (e.g. `spare-inventory`), and
   finish the wizard (you can skip Google Analytics).
3. Once created, click the **web icon (`</>`)** on the project overview
   page to register a web app. Give it any nickname, skip hosting setup.
4. Firebase will show you a `firebaseConfig` object like this:
   ```js
   const firebaseConfig = {
     apiKey: "AIzaSy...",
     authDomain: "spare-inventory-xxxx.firebaseapp.com",
     projectId: "spare-inventory-xxxx",
     storageBucket: "spare-inventory-xxxx.appspot.com",
     messagingSenderId: "123456789",
     appId: "1:123456789:web:abcdef"
   };
   ```
   Copy this whole block.
5. Open **`index.html`** in this folder, find the `firebaseConfig` section
   near the top of the `<script>` block (search for `YOUR_API_KEY`), and
   paste your real values in, replacing the placeholders.
6. Back in the Firebase Console, go to **Build > Firestore Database >
   Create database**. Choose **production mode**, pick any region, click
   **Enable**.
7. Once created, go to the **Rules** tab and replace the rules with:
   ```
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /{document=**} {
         allow read, write: if true;
       }
     }
   }
   ```
   Click **Publish**.

   ⚠️ Note: this makes the data readable/writable by anyone who has your
   app's link — fine for an internal tool shared only with your team, but
   don't rely on this for sensitive data. Ask me later if you want proper
   access control (e.g. a login step) added.

## Step 1b — Turn on the login screen (Firebase Authentication)

The app now shows a simple email + password login screen before anyone can
see the inventory. No roles, no admin/user split — anyone with a valid
login sees the same thing.

**Note on access control:** this version lets anyone with the link create
their own account right there (a "Sign up" link under the login button),
as well as log in if they already made one. This means you are no longer
personally deciding who gets in — whoever has the link can join. If you'd
rather go back to only-accounts-you-create, let Claude know and it can
flip this back (it's a one-line change).

1. In the Firebase Console, go to **Build > Authentication > Get started**.
2. Click the **Sign-in method** tab, click **Email/Password**, toggle it
   **Enable**, and click **Save**. (You don't need to add users manually
   in the Users tab anymore — people will create their own accounts from
   the app's "Sign up" link.)
3. That's it — since you've already pasted your firebaseConfig into
   index.html in Step 1, the login/signup screen will work automatically
   once this is deployed.

**Optional but recommended — tighten the database rules now that login exists:**
Go back to **Firestore Database > Rules** and replace the open rule from
Step 1 with this stricter one, so only logged-in users can read or write:
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```
Click **Publish**.

## Step 2 — Deploy to Vercel

1. Go to https://vercel.com and sign up (free) — easiest is "Continue
   with GitHub" or "Continue with email."
2. On your Vercel dashboard, click **"Add New" → "Project"**.
3. Choose **"Deploy without Git"** (if offered) or drag-and-drop this
   whole folder onto the upload area when prompted. Vercel will detect
   it's a static site automatically — no build settings needed.
4. Click **Deploy**. In under a minute you'll get a live URL like
   `https://spare-inventory-xyz.vercel.app`.
5. Open that link on your phone and laptop — you should see the same
   live inventory on both, and issuing/adding stock on one instantly
   shows up on the other.
6. On your phone, open the link in Chrome/Safari and tap **"Add to Home
   Screen"** — it'll install with its own icon and open full-screen, no
   browser bar, no Claude in the loop.

---

## Files in this folder
- `index.html` — the app itself
- `manifest.json` — tells the phone how to install it (name, icon, colors)
- `sw.js` — minimal service worker required for installability
- `icon-192.png` / `icon-512.png` — app icons (feel free to replace with
  your own logo, same file names and sizes)

If anything doesn't sync after deploying, the most common cause is a typo
in `firebaseConfig` or forgetting to publish the Firestore rules — check
those first.
