// Import thumbnails
import alQuranThumb from "@/assets/thumbnails/al-quran.jpg";
import portfolioThumb from "@/assets/thumbnails/portfolio.jpg";
import campusConnectThumb from "@/assets/thumbnails/campus-connect.jpg";
import studyHelperThumb from "@/assets/thumbnails/study-helper.jpg";
import tabeyaAiThumb from "@/assets/thumbnails/tabeya-ai.jpg";
import calendeThumb from "@/assets/thumbnails/calende.jpg";
import workoutFlexThumb from "@/assets/thumbnails/workout-flex.jpg";
import songDiscoveredThumb from "@/assets/thumbnails/song-discovered.jpg";
import realspaceDesignerThumb from "@/assets/thumbnails/realspace-designer.jpg";
import weatherAppThumb from "@/assets/thumbnails/weather-app.jpg";
import ecommerceThumb from "@/assets/thumbnails/ecommerce-demo.jpg";
import socialMediaThumb from "@/assets/thumbnails/social-media.jpg";
import chatAppThumb from "@/assets/thumbnails/chat-app.jpg";
import onlineCourseThumb from "@/assets/thumbnails/online-course.jpg";
import moneyTrackerThumb from "@/assets/thumbnails/money-tracker.jpg";
import gamesThumb from "@/assets/thumbnails/games.jpg";
import youtubeThumb from "@/assets/thumbnails/youtube.jpg";
import screenRecorderThumb from "@/assets/thumbnails/screen-recorder.jpg";
import imageConverterThumb from "@/assets/thumbnails/image-converter.jpg";
import qrGeneratorThumb from "@/assets/thumbnails/qr-generator.jpg";
import videoCallThumb from "@/assets/thumbnails/video-call.jpg";
import voiceCallThumb from "@/assets/thumbnails/voice-call.jpg";
import smartboardThumb from "@/assets/thumbnails/smartboard.jpg";
import pocketDiceThumb from "@/assets/thumbnails/pocket-dice.jpg";
import lockDiaryThumb from "@/assets/thumbnails/lock-diary.jpg";
import sosAppThumb from "@/assets/thumbnails/sos-app.jpg";
import land360Thumb from "@/assets/thumbnails/land360.jpg";
import invoiceCreatorThumb from "@/assets/thumbnails/invoice-creator.jpg";
import webPlaygroundThumb from "@/assets/thumbnails/web-playground.jpg";
import hscQuizThumb from "@/assets/thumbnails/hsc-quiz.jpg";
import resultDashboardThumb from "@/assets/thumbnails/result-dashboard.jpg";
import mediaPlayerThumb from "@/assets/thumbnails/media-player.jpg";
import translatorThumb from "@/assets/thumbnails/translator.jpg";
import focusTimerThumb from "@/assets/thumbnails/focus-timer.jpg";
import eventSplitterThumb from "@/assets/thumbnails/event-splitter.jpg";
import mgxDemoThumb from "@/assets/thumbnails/mgx-demo.jpg";
import muslimCornerThumb from "@/assets/thumbnails/muslim-corner.jpg";
// New unique thumbnails
import ramadanCompanionThumb from "@/assets/thumbnails/ramadan-companion.jpg";
import dailyDuasThumb from "@/assets/thumbnails/daily-duas.jpg";
import socialNetworkThumb from "@/assets/thumbnails/social-network.jpg";
import studywizJournalThumb from "@/assets/thumbnails/studywiz-journal.jpg";
import megatoolsThumb from "@/assets/thumbnails/megatools.jpg";
import ludoMasterThumb from "@/assets/thumbnails/ludo-master.jpg";
import breachCheckerThumb from "@/assets/thumbnails/breach-checker.jpg";
import bangladeshCalendarThumb from "@/assets/thumbnails/bangladesh-calendar.jpg";
import takaTrackAiThumb from "@/assets/thumbnails/taka-track-ai.jpg";
import decideRoomThumb from "@/assets/thumbnails/decide-room.jpg";
import iconjoyVaultThumb from "@/assets/thumbnails/iconjoy-vault.jpg";
import allinoneCameraThumb from "@/assets/thumbnails/allinone-camera.jpg";
import tasbihProThumb from "@/assets/thumbnails/tasbih-pro.jpg";
import travelWithTalhaThumb from "@/assets/thumbnails/travel-with-talha.jpg";
import flipclockThumb from "@/assets/thumbnails/flipclock.jpg";
import passwordProtectThumb from "@/assets/thumbnails/password-protect.jpg";

export interface Project {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  appUrl: string;
  category: string;
  featured?: boolean;
  premium?: boolean;
}

export const projects: Project[] = [
  // ===== AL-QURAN (Always First) =====
  {
    id: "al-quran",
    title: "Al Quran",
    description: "Quran reading app with audio, dua, tafsir and easy browsing",
    thumbnail: alQuranThumb,
    appUrl: "https://al-quran-22267.vercel.app/",
    category: "Religion",
    featured: true,
    premium: true
  },

  // ===== MUSLIM CORNER (Right after Al Quran) =====
  {
    id: "muslim-corner",
    title: "Muslim Corner",
    description: "Complete Islamic library with Quran, Hadith collections, and authentic Islamic books",
    thumbnail: muslimCornerThumb,
    appUrl: "https://muslim-corner-by-talha.lovable.app",
    category: "Religion",
    featured: true,
    premium: true
  },

  // ===== INSERTED PREMIUM PROJECTS (After Muslim Corner) =====
  {
    id: "ramadan-companion",
    title: "Ramadan Companion",
    description: "Your essential Ramadan guide with Sehri/Iftar times, dua collection, and daily tracker",
    thumbnail: ramadanCompanionThumb,
    appUrl: "https://ramadan-companio-bytalha.lovable.app",
    category: "Religion",
    featured: true,
    premium: true
  },
  {
    id: "daily-duas",
    title: "Daily Duas",
    description: "Beautiful collection of daily supplications with Arabic text, transliteration and meaning",
    thumbnail: dailyDuasThumb,
    appUrl: "https://dailyduas.lovable.app",
    category: "Religion",
    featured: true,
    premium: true
  },
  {
    id: "social-network",
    title: "Social Network",
    description: "Full-featured Facebook-style social platform with posts, friends, and real-time chat",
    thumbnail: socialNetworkThumb,
    appUrl: "https://social-network-mhtfinal.lovable.app",
    category: "Social Media",
    premium: true
  },

  // ===== Previously Existing Premium Projects (continuing) =====
  {
    id: "flowrec",
    title: "FlowRec",
    description: "Advanced screen recording and streaming tool for PC",
    thumbnail: screenRecorderThumb,
    appUrl: "https://flowrecby-talha-final.lovable.app",
    category: "Productivity",
    featured: true,
    premium: true
  },
  {
    id: "private-vault",
    title: "Private Vault",
    description: "Secure vault to store and protect your private files and data",
    thumbnail: lockDiaryThumb,
    appUrl: "https://privatevault-01.lovable.app/",
    category: "Utility",
    featured: true,
    premium: true
  },
  {
    id: "lock-diary",
    title: "Lock Diary",
    description: "Password-protected diary for personal notes and journaling",
    thumbnail: lockDiaryThumb,
    appUrl: "https://lock-diary-bytalha.vercel.app/",
    category: "Lifestyle",
    featured: true,
    premium: true
  },
  {
    id: "chatspark",
    title: "ChatSpark",
    description: "Real-time messaging app for instant communication",
    thumbnail: chatAppThumb,
    appUrl: "https://chatsparkwithyouandme2.lovable.app",
    category: "Communication",
    featured: true,
    premium: true
  },
  // ===== NEW PREMIUM PROJECTS (After ChatSpark) =====
  {
    id: "studywiz-journal",
    title: "StudyWiz Journal",
    description: "Smart study journal with note-taking, progress tracking, and study schedule planner",
    thumbnail: studywizJournalThumb,
    appUrl: "https://studywiz-journal-by-talha.lovable.app",
    category: "Education",
    premium: true
  },
  {
    id: "allinone-megatools",
    title: "All-in-One MegaTools",
    description: "Ultimate utility toolkit with 50+ tools including converter, calculator, and generators",
    thumbnail: megatoolsThumb,
    appUrl: "https://allinone-megatools.lovable.app",
    category: "Utility",
    premium: true
  },
  {
    id: "ludo-master",
    title: "Ludo Master",
    description: "Classic Ludo board game with online multiplayer, AI opponents, and tournaments",
    thumbnail: ludoMasterThumb,
    appUrl: "https://ludomasterfinal.lovable.app",
    category: "Games",
    premium: true
  },
  {
    id: "breach-checker",
    title: "Breach Checker",
    description: "Check if your email or password was exposed in data breaches and stay secure",
    thumbnail: breachCheckerThumb,
    appUrl: "https://breachchecker.lovable.app",
    category: "Security",
    premium: true
  },
  {
    id: "bangladesh-calendar-2026",
    title: "Bangladesh Calendar 2026",
    description: "Bengali calendar with government holidays, Islamic dates, and event reminders",
    thumbnail: bangladeshCalendarThumb,
    appUrl: "https://bangladeshcalender2026.lovable.app",
    category: "Productivity",
    premium: true
  },
  {
    id: "taka-track-ai",
    title: "Taka Track AI",
    description: "AI-powered expense tracker for Bangladeshi Taka with smart insights and budgeting",
    thumbnail: takaTrackAiThumb,
    appUrl: "https://takatrackai.lovable.app",
    category: "Finance",
    premium: true
  },
  {
    id: "decide-room",
    title: "Decide Room",
    description: "Collaborative decision-making tool for teams with voting, polls, and consensus building",
    thumbnail: decideRoomThumb,
    appUrl: "https://decide-room.lovable.app",
    category: "Utility",
    premium: true
  },
  {
    id: "studyflow",
    title: "StudyFlow",
    description: "Complete study management app with schedules and progress tracking",
    thumbnail: studyHelperThumb,
    appUrl: "https://studyflowbytalha-final.vercel.app/",
    category: "Education",
    featured: true,
    premium: true
  },
  {
    id: "hsc-ques-exam",
    title: "HSC Ques & Exam",
    description: "HSC question bank and exam practice platform",
    thumbnail: hscQuizThumb,
    appUrl: "https://hsc-ques-and-exam-bytalha.lovable.app",
    category: "Education",
    featured: true,
    premium: true
  },
  {
    id: "pure-python-jarvis",
    title: "Pure Python Jarvis",
    description: "AI assistant powered by Python for automation and tasks",
    thumbnail: tabeyaAiThumb,
    appUrl: "https://pure-python-jarvis.lovable.app",
    category: "AI / ML",
    featured: true,
    premium: true
  },
  {
    id: "personal-ai",
    title: "Personal AI",
    description: "Your personal AI companion for daily assistance",
    thumbnail: tabeyaAiThumb,
    appUrl: "https://talhas-personal-ai.lovable.app",
    category: "AI / ML",
    featured: true,
    premium: true
  },
  {
    id: "workspace-canvas-pro",
    title: "Workspace Canvas Pro",
    description: "Professional workspace and canvas for creative projects",
    thumbnail: smartboardThumb,
    appUrl: "https://workspace-canvaspro-by-talha.lovable.app",
    category: "Productivity",
    featured: true,
    premium: true
  },
  {
    id: "cycletime-monthly",
    title: "CycleTime Monthly",
    description: "Monthly cycle tracking and health monitoring app",
    thumbnail: calendeThumb,
    appUrl: "https://cycletime-monthly.vercel.app/",
    category: "Health & Fitness",
    featured: true,
    premium: true
  },
  {
    id: "safe-haven-timer",
    title: "Safe Haven Timer",
    description: "Productivity timer with focus sessions and break reminders",
    thumbnail: focusTimerThumb,
    appUrl: "https://remix-of-safe-haven-timer.vercel.app/",
    category: "Productivity",
    featured: true,
    premium: true
  },
  {
    id: "mesbahul-alam-library",
    title: "Mesbahul Alam Library",
    description: "Digital library platform for educational resources and books",
    thumbnail: onlineCourseThumb,
    appUrl: "https://mesbahulalam-library01.lovable.app",
    category: "Education",
    featured: true,
    premium: true
  },

  // ===== EXISTING PROJECTS (Same Order) =====
  {
    id: "portfolio",
    title: "Portfolio Website",
    description: "My personal portfolio showcasing projects, skills, and journey as a web developer",
    thumbnail: portfolioThumb,
    appUrl: "https://talha-2008.github.io/biodata/",
    category: "Web Development",
    featured: true,
    premium: true
  },
  {
    id: "campusconnect",
    title: "Campus Connect",
    description: "A platform connecting campus students and enabling collaboration",
    thumbnail: campusConnectThumb,
    appUrl: "https://campusconect.lovable.app/",
    category: "Web Development",
    featured: true,
    premium: false
  },
  {
    id: "study-helper",
    title: "All-in-One Study Helper",
    description: "Complete study companion with tools and resources for students",
    thumbnail: studyHelperThumb,
    appUrl: "https://all-in-one-studyhelper.lovable.app/auth",
    category: "Education",
    featured: true,
    premium: true
  },
  {
    id: "tabeya-ai",
    title: "Tabeya AI Companion",
    description: "AI-powered companion app for personalized assistance",
    thumbnail: tabeyaAiThumb,
    appUrl: "https://tabeya-ai-companion.lovable.app",
    category: "AI / ML",
    featured: true,
    premium: true
  },
  {
    id: "calende",
    title: "Calende by Talha",
    description: "Modern calendar and scheduling application",
    thumbnail: calendeThumb,
    appUrl: "https://calende-by-talha.lovable.app/",
    category: "Productivity"
  },
  {
    id: "workout-flex",
    title: "Workout Flex",
    description: "Fitness tracking and workout planning application",
    thumbnail: workoutFlexThumb,
    appUrl: "https://workout-flex-by-talha.lovable.app/onboarding",
    category: "Health & Fitness",
    premium: true
  },
  {
    id: "song-discovered",
    title: "Song Discovered by Talha",
    description: "Discover and explore new songs with an interactive music discovery platform",
    thumbnail: songDiscoveredThumb,
    appUrl: "https://song-discovered-by-talha.lovable.app/",
    category: "Entertainment"
  },
  {
    id: "youtube-clone",
    title: "YouTube",
    description: "Create your own video sharing platform with comments and subscriptions",
    category: "Social Media",
    appUrl: "https://cinereel-by-talha.lovable.app/",
    thumbnail: youtubeThumb,
    featured: false,
    premium: true,
  },
  {
    id: "realspace-designer",
    title: "Realspace Designer",
    description: "AR-powered room designer to visualize and plan your interior design",
    thumbnail: realspaceDesignerThumb,
    appUrl: "https://realspace-designer.lovable.app",
    category: "AR Design"
  },
  {
    id: "weather-app",
    title: "Weather App",
    description: "আপনার বর্তমান অবস্থানের আবহাওয়ার তথ্য দেখানোর জন্য একটি ইন্টারেক্টিভ ওয়েব অ্যাপ",
    thumbnail: weatherAppThumb,
    appUrl: "https://talha-171219.github.io/weather-app/",
    category: "Utility"
  },
  {
    id: "ai-mini-bot",
    title: "AI Mini Bot",
    description: "একটি ছোট এআই চ্যাটবট যা ব্যবহারকারীদের সাধারণ প্রশ্নের উত্তর দিতে পারে",
    thumbnail: tabeyaAiThumb,
    appUrl: "https://talha388204.github.io/AI-CHATBOT/full-error%20free",
    category: "AI / ML"
  },
  {
    id: "online-course",
    title: "Online Course Platform",
    description: "Course listing and simple lesson viewer for online learning demos",
    thumbnail: onlineCourseThumb,
    appUrl: "https://talha-388204.github.io/ONLINE-COURSE-PLATFORM/",
    category: "Education",
    premium: false
  },
  {
    id: "ecommerce-demo",
    title: "E-Commerce Demo",
    description: "ডেমো ই-কমার্স সাইট — প্রোডাক্ট ব্রাউজিং ও কার্ট ফ্লো দেখায়",
    thumbnail: ecommerceThumb,
    appUrl: "https://talha388204.github.io/E-Commerce-demo-by-talha/#/",
    category: "E-Commerce"
  },
  {
    id: "facebook-clone",
    title: "Facebook Clone",
    description: "ফেসবুক স্টাইল ডেমো — সাইন-আপ, প্রোফাইল ও পোস্ট প্রদর্শন",
    thumbnail: socialMediaThumb,
    appUrl: "https://talha388204.github.io/great-social-app/",
    category: "Social Media",
    premium: false
  },
  {
    id: "simple-social",
    title: "Simple Social App",
    description: "একটি সাধারণ সোশ্যাল মিডিয়া ডেমো — প্রোফাইল ও পোষ্ট প্রদর্শন করে",
    thumbnail: socialMediaThumb,
    appUrl: "https://talha-171219.github.io/social-media/",
    category: "Social Media"
  },
  {
    id: "personal-chat",
    title: "Personal Chat",
    description: "লাইটওয়েট চ্যাট অ্যাপ ডেমো — প্রাইভেট মেসেজিং ইন্টারফেস",
    thumbnail: chatAppThumb,
    appUrl: "https://talha-171219.github.io/lite-chat-app.minha/",
    category: "Communication"
  },
  {
    id: "chat-app",
    title: "Chat App",
    description: "মেসেজিং ডেমো — রিয়েলটাইম চ্যাট বেসিক ফিচার দেখায়",
    thumbnail: chatAppThumb,
    appUrl: "https://talha-171219.github.io/apk-chat/",
    category: "Communication"
  },
  {
    id: "event-splitter",
    title: "Event Splitter",
    description: "ইভেন্ট বা সময় সহজে ভাগ করার জন্য একটি ইউটিলিটি টুল",
    thumbnail: eventSplitterThumb,
    appUrl: "https://talha-c731xh03xl.mgx.world/",
    category: "Utility"
  },
  {
    id: "money-tracker",
    title: "Money Tracking",
    description: "দৈনন্দিন আয়-ব্যয় ট্র্যাক করার জন্য একটি সহজ অ্যাপ",
    thumbnail: moneyTrackerThumb,
    appUrl: "https://talha388204.github.io/money-tracker/",
    category: "Finance",
    premium: false
  },
  {
    id: "focus-timer",
    title: "Focus Timer",
    description: "Pomodoro টাইমার — মনোযোগ বাড়ানোর জন্য",
    thumbnail: focusTimerThumb,
    appUrl: "https://talha388204.github.io/focus-timer/timer-2",
    category: "Productivity"
  },
  {
    id: "song-app",
    title: "Song App",
    description: "A lightweight music player demo to play and browse songs",
    thumbnail: mediaPlayerThumb,
    appUrl: "https://talha-2008.github.io/song-app/",
    category: "Entertainment"
  },
  {
    id: "browser-demo",
    title: "Browser",
    description: "Hosted demo app showcasing small experiments",
    thumbnail: mgxDemoThumb,
    appUrl: "https://talha-nbx9hswi6z.mgx.world",
    category: "Demo"
  },
  {
    id: "app-lock-demo",
    title: "App Lock Demo",
    description: "Interactive playground on mgx.world",
    thumbnail: mgxDemoThumb,
    appUrl: "https://talha-ihh2men5lvc.mgx.world",
    category: "Demo"
  },
  {
    id: "travel-companion",
    title: "Travel Companion",
    description: "Frontend experiments and UI showcase",
    thumbnail: mgxDemoThumb,
    appUrl: "https://talha-gi6t9ppy8ae.mgx.world",
    category: "Demo"
  },
  {
    id: "capcut-lite-demo",
    title: "Capcut Lite Demo",
    description: "Hosted demo app / playground on mgx.world",
    thumbnail: mgxDemoThumb,
    appUrl: "https://talha-dhchttrobui.mgx.world",
    category: "Demo"
  },
  {
    id: "image-converter",
    title: "Image Converter",
    description: "Convert images between formats and perform basic edits in the browser",
    thumbnail: imageConverterThumb,
    appUrl: "https://talha-388204.github.io/Image-converter/",
    category: "Utility",
    premium: false
  },
  {
    id: "qr-generator",
    title: "QR Code Generator",
    description: "Generate QR codes for URLs or text and download them as images",
    thumbnail: qrGeneratorThumb,
    appUrl: "https://talha-388204.github.io/QR-Code-generator/",
    category: "Utility",
    premium: false
  },
  {
    id: "video-call",
    title: "Video Call (2 person)",
    description: "A demo showing basic voice & video call functionality in the browser",
    thumbnail: videoCallThumb,
    appUrl: "https://talha-171219.github.io/Voice-call/video",
    category: "Communication",
    premium: true
  },
  {
    id: "voice-call",
    title: "Voice Call (2 person)",
    description: "Simple voice call demo to test audio streaming between peers",
    thumbnail: voiceCallThumb,
    appUrl: "https://talha-171219.github.io/Voice-call/",
    category: "Communication"
  },
  {
    id: "smartboard",
    title: "Smartboard",
    description: "Interactive whiteboard for drawing and collaboration in the browser",
    thumbnail: smartboardThumb,
    appUrl: "https://talha-171219.github.io/Smartboard/",
    category: "Productivity"
  },
  {
    id: "pocket-dice",
    title: "Pocket Dice",
    description: "Virtual dice roller — handy for games and decision making",
    thumbnail: pocketDiceThumb,
    appUrl: "https://talha-171219.github.io/pocket-dice/",
    category: "Entertainment"
  },
  {
    id: "personal-finance",
    title: "Personal Finance",
    description: "Income & expense tracker to help manage daily finances",
    thumbnail: moneyTrackerThumb,
    appUrl: "https://talha-171219.github.io/personal-finance-/",
    category: "Finance"
  },
  {
    id: "sos-app",
    title: "SOS App",
    description: "Emergency alert app to quickly contact predefined helpers",
    thumbnail: sosAppThumb,
    appUrl: "https://talha-2008.github.io/SOS-APP/",
    category: "Safety",
    premium: false
  },
  {
    id: "land360",
    title: "Land360",
    description: "জমি জমার তথ্য দেখার জন্য একটি ইন্টারেক্টিভ অ্যাপ",
    thumbnail: land360Thumb,
    appUrl: "https://talha-2008.github.io/land360/",
    category: "Real Estate",
    premium: true
  },
  {
    id: "invoice-creator",
    title: "Invoice Creator",
    description: "Create and export invoices quickly from a simple form interface",
    thumbnail: invoiceCreatorThumb,
    appUrl: "https://talha-388204.github.io/Invoice-creator/",
    category: "Business"
  },
  {
    id: "web-playground",
    title: "Web Playground",
    description: "A small playground with UI experiments and frontend snippets",
    thumbnail: webPlaygroundThumb,
    appUrl: "https://talha-388204.github.io/-web-playground/",
    category: "Demo"
  },
  {
    id: "hsc-quiz",
    title: "HSC Quiz App",
    description: "Interactive quiz application for HSC students",
    thumbnail: hscQuizThumb,
    appUrl: "https://app-lime-panda.reflex.run/",
    category: "Education",
    premium: false
  },
  {
    id: "result-dashboard",
    title: "Result Dashboard",
    description: "Dashboard demo for displaying results, metrics and simple charts",
    thumbnail: resultDashboardThumb,
    appUrl: "https://resultdashboard-reflex-navy-ocean.reflex.run/",
    category: "Education",
    premium: false
  },
  {
    id: "pixel-runner",
    title: "Pixel Runner",
    description: "Browser-based pixel art runner game — jump, run and collect points",
    thumbnail: gamesThumb,
    appUrl: "https://talha-2008.github.io/pixel-runner/",
    category: "Games"
  },
  {
    id: "tic-tac-toe",
    title: "Tic Tac Toe",
    description: "Classic tic-tac-toe game you can play against a friend or the computer",
    thumbnail: gamesThumb,
    appUrl: "https://talha-2008.github.io/tic-tac-toe-/",
    category: "Games"
  },
  {
    id: "media-player",
    title: "Media Player",
    description: "Audio/video player demo with custom controls and playlists",
    thumbnail: mediaPlayerThumb,
    appUrl: "https://talha-2008.github.io/media-player/",
    category: "Entertainment"
  },
  {
    id: "translator",
    title: "Translator App",
    description: "Simple text translator demo to convert between languages",
    thumbnail: translatorThumb,
    appUrl: "https://talha-2008.github.io/Translator-app/",
    category: "Utility"
  },

  // ===== SIMPLE APPS (Moved from Premium) =====
  {
    id: "iconjoy-vault",
    title: "IconJoy Vault",
    description: "Curated collection of 10,000+ premium icons and assets for designers and developers",
    thumbnail: iconjoyVaultThumb,
    appUrl: "https://iconjoy-vault.lovable.app",
    category: "Utility",
    featured: false
  },
  {
    id: "allinone-camerav2",
    title: "All-in-One Camera v2",
    description: "Pro camera app with 40+ filters, beauty mode, and professional editing tools",
    thumbnail: allinoneCameraThumb,
    appUrl: "https://allinone-camerav2.lovable.app",
    category: "Photography",
    featured: false
  },
  {
    id: "tasbihpro",
    title: "Tasbih Pro",
    description: "Digital tasbih counter with 99 names of Allah, multiple counters, and daily goals",
    thumbnail: tasbihProThumb,
    appUrl: "https://tasbihpro.lovable.app",
    category: "Religion",
    featured: false
  },
  {
    id: "travel-with-talha",
    title: "Travel with Talha",
    description: "Explore travel destinations, plan trips, and discover hidden gems around the world",
    thumbnail: travelWithTalhaThumb,
    appUrl: "https://travel-with-talha.lovable.app",
    category: "Travel",
    featured: false
  },
  {
    id: "flipclock-final",
    title: "FlipClock Final",
    description: "Beautiful retro flip clock with customizable themes, alarms, and world time zones",
    thumbnail: flipclockThumb,
    appUrl: "https://flipclock-final.lovable.app",
    category: "Productivity",
    featured: false
  },
  {
    id: "passwordprotect",
    title: "Password Protect",
    description: "Secure vault to protect your files and notes with military-grade encryption",
    thumbnail: passwordProtectThumb,
    appUrl: "https://passwordprotect.lovable.app",
    category: "Security",
    featured: false
  },
  {
    id: "hajj-journey-guide",
    title: "Hajj Journey Guide",
    description: "Complete guide for Hajj pilgrimage with step-by-step instructions",
    thumbnail: alQuranThumb,
    appUrl: "https://hajj-journey-guide-by-talha.lovable.app",
    category: "Religion",
    featured: false
  },
  {
    id: "telegram-id",
    title: "Telegram ID",
    description: "Utility tool to find and share Telegram user IDs",
    thumbnail: chatAppThumb,
    appUrl: "https://telegram-id-hazel.vercel.app/",
    category: "Utility",
    featured: false
  }
];

export const getBioData = () => ({
  name: "Monirul Hasan Talha",
  tagline: "Web Developer & Tech Enthusiast",
  bio: "I'm a passionate web developer specializing in HTML, CSS, JavaScript and React. I love creating beautiful, functional websites and exploring new technologies.",
  location: "Bogura, Bangladesh",
  phone: "01909751433",
  email: "monirulhasantalha@gmail.com",
  skills: ["HTML", "CSS", "JavaScript", "React", "Node.js", "TypeScript"],
  social: {
    github: "https://github.com/talha-171219",
    facebook: "https://www.facebook.com/talha171219",
    whatsapp: "https://wa.me/qr/B2VPVRBPNQAZF1",
    telegram: "https://t.me/talha91108",
    email: "mailto:monirulhasantalha@gmail.com"
  }
});
