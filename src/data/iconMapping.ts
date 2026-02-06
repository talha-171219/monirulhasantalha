import aiChatbotIcon from "@/assets/icons/ai-chatbot.png";
import ecommerceIcon from "@/assets/icons/ecommerce.png";
import travelIcon from "@/assets/icons/travel.png";
import educationIcon from "@/assets/icons/education.png";
import fitnessIcon from "@/assets/icons/fitness.png";
import productivityIcon from "@/assets/icons/productivity.png";
import socialIcon from "@/assets/icons/social.png";
import gamingIcon from "@/assets/icons/gaming.png";
import quranIcon from "@/assets/icons/quran.png";
import musicIcon from "@/assets/icons/music.png";
import arDesignerIcon from "@/assets/icons/ar-designer.png";
import defaultIcon from "@/assets/default-project-icon.jpg";

export const getIconForProject = (title: string, category: string): string => {
  const titleLower = title.toLowerCase();
  const categoryLower = category.toLowerCase();

  // New project-specific mappings
  if (titleLower.includes("ramadan") || titleLower.includes("dua") || titleLower.includes("duas")) {
    return quranIcon;
  }

  if (titleLower.includes("studywiz") || titleLower.includes("journal") || titleLower.includes("studywiz journal")) {
    return educationIcon;
  }

  if (titleLower.includes("mega") || titleLower.includes("megatools") || titleLower.includes("mega tools")) {
    return productivityIcon;
  }

  if (titleLower.includes("ludo") || titleLower.includes("ludo master")) {
    return gamingIcon;
  }

  if (titleLower.includes("breach") || titleLower.includes("breach-checker")) {
    return defaultIcon;
  }

  if (titleLower.includes("bangladesh") && titleLower.includes("calendar")) {
    return productivityIcon;
  }

  if (titleLower.includes("decide") || titleLower.includes("decide-room")) {
    return productivityIcon;
  }

  // Quran & Religion related
  if (titleLower.includes("quran") || titleLower.includes("al quran") || 
      categoryLower.includes("religion") || categoryLower.includes("islamic")) {
    return quranIcon;
  }

  // Music & Entertainment
  if (titleLower.includes("song") || titleLower.includes("music") || titleLower.includes("audio") || 
      categoryLower.includes("music") || categoryLower.includes("entertainment")) {
    return musicIcon;
  }

  // AR & Design related
  if (titleLower.includes("ar") || titleLower.includes("designer") || titleLower.includes("room") || 
      titleLower.includes("realspace") || categoryLower.includes("ar") || categoryLower.includes("design")) {
    return arDesignerIcon;
  }

  // AI & Chatbot related
  if (titleLower.includes("ai") || titleLower.includes("chatbot") || titleLower.includes("bot") || 
      categoryLower.includes("ai") || categoryLower.includes("chatbot")) {
    return aiChatbotIcon;
  }

  // E-commerce related
  if (titleLower.includes("shop") || titleLower.includes("store") || titleLower.includes("cart") || 
      titleLower.includes("ecommerce") || categoryLower.includes("ecommerce") || categoryLower.includes("shopping")) {
    return ecommerceIcon;
  }

  // Travel related
  if (titleLower.includes("travel") || titleLower.includes("tour") || titleLower.includes("trip") || 
      titleLower.includes("diary") || categoryLower.includes("travel")) {
    return travelIcon;
  }

  // Education related
  if (titleLower.includes("study") || titleLower.includes("learn") || titleLower.includes("education") || 
      titleLower.includes("student") || titleLower.includes("campus") || titleLower.includes("course") ||
      categoryLower.includes("education") || categoryLower.includes("learning")) {
    return educationIcon;
  }

  // Fitness & Health related
  if (titleLower.includes("fitness") || titleLower.includes("workout") || titleLower.includes("health") || 
      titleLower.includes("exercise") || titleLower.includes("gym") || categoryLower.includes("fitness") || 
      categoryLower.includes("health")) {
    return fitnessIcon;
  }

  // Productivity & Tools
  if (titleLower.includes("calendar") || titleLower.includes("task") || titleLower.includes("todo") || 
      titleLower.includes("note") || titleLower.includes("planner") || titleLower.includes("converter") ||
      titleLower.includes("qr") || titleLower.includes("generator") || categoryLower.includes("productivity") || 
      categoryLower.includes("tools") || categoryLower.includes("utility")) {
    return productivityIcon;
  }

  // Social & Communication
  if (titleLower.includes("social") || titleLower.includes("chat") || titleLower.includes("connect") || 
      titleLower.includes("community") || categoryLower.includes("social") || categoryLower.includes("communication")) {
    return socialIcon;
  }

  // Gaming
  if (titleLower.includes("game") || titleLower.includes("play") || titleLower.includes("gaming") || 
      categoryLower.includes("game") || categoryLower.includes("gaming")) {
    return gamingIcon;
  }

  // Default icon for unmatched projects
  return defaultIcon;
};
