========================================
COMPLETE UI UPDATE PACKAGE
========================================

This package contains ALL 4 updated screen files with the exact UI design from your reference screenshots.

FILES INCLUDED:
1. index.tsx  - Home screen (greeting, motivation card, master goal, quick ask)
2. chat.tsx   - AI Chat screen (empty state, message bubbles)
3. goals.tsx  - Goal Planning screen (master goal with PRIMARY badge, sections)
4. mood.tsx   - Journal screen (affirmations, gratitude, visualize tabs)

========================================
INSTALLATION INSTRUCTIONS:
========================================

Step 1: BACKUP YOUR CURRENT FILES
---------------------------------
cd your-local-project/ai-success-coach/AISuccessCoach/app/(tabs)/
cp index.tsx index.tsx.backup
cp chat.tsx chat.tsx.backup
cp goals.tsx goals.tsx.backup
cp mood.tsx mood.tsx.backup

Step 2: REPLACE WITH NEW FILES
-------------------------------
Copy all 4 .tsx files from this package to:
your-local-project/ai-success-coach/AISuccessCoach/app/(tabs)/

Replace:
- index.tsx
- chat.tsx
- goals.tsx
- mood.tsx

Step 3: START METRO BUNDLER
----------------------------
cd your-local-project/ai-success-coach/AISuccessCoach
npx expo start --clear

Step 4: SCAN QR CODE
--------------------
Open Expo Go on your phone and scan the QR code from your terminal.

========================================
WHAT YOU'LL SEE:
========================================

✅ Beautiful rounded cards with borders (rounded-3xl)
✅ Blue background for Today's Motivation card
✅ White cards with gray borders for Master Goal, Quick Ask
✅ Proper card styling on Chat screen with empty state
✅ Blue-bordered Master Goal card with PRIMARY badge
✅ Styled tab buttons on Journal screen
✅ All proper spacing, padding, and typography

========================================
TROUBLESHOOTING:
========================================

If UI still looks wrong after update:
1. Make sure you replaced ALL 4 files
2. Clear Metro cache: npx expo start --clear
3. Close and reopen Expo Go app on your phone
4. Check that you're in the correct directory

========================================
